import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || user?.email?.split("@")[0] || "User",
    email: user?.email || "",
    phone: "",
    location: "",
    title: "",
    company: "",
    bio: "",
    interests: [],
    joinDate: new Date().toISOString().slice(0, 10),
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    if (userProfile || user) {
      const populated = {
        name:
          userProfile?.name ||
          user?.user_metadata?.name ||
          user?.email?.split("@")[0] ||
          "User",
        email: user?.email || userProfile?.email || "",
        phone: userProfile?.phone || "",
        location: userProfile?.location || "",
        title: userProfile?.title || "",
        company: userProfile?.company || "",
        bio: userProfile?.bio || "",
        interests: Array.isArray(userProfile?.interests)
          ? userProfile.interests
          : [],
        joinDate:
          userProfile?.created_at ||
          user?.created_at ||
          new Date().toISOString().slice(0, 10),
      };
      setProfile(populated);
      setEditedProfile(populated);
    }
  }, [userProfile, user]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setSaving(true);
      setError("");
      const updates = {
        name: editedProfile.name || "",
        email: editedProfile.email || user?.email || "",
        phone: editedProfile.phone || "",
        location: editedProfile.location || "",
        title: editedProfile.title || "",
        company: editedProfile.company || "",
        bio: editedProfile.bio || "",
        interests: Array.isArray(editedProfile.interests)
          ? editedProfile.interests
          : [],
      };
      const { error: updateError } = await updateProfile(updates);
      if (updateError) {
        setError(updateError.message || "Failed to save profile");
        return;
      }
      setProfile((prev) => ({ ...prev, ...updates }));
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInterestsChange = (value) => {
    const interests = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setEditedProfile((prev) => ({
      ...prev,
      interests,
    }));
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your personal information and preferences
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors w-full sm:w-auto justify-center"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2 w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="flex flex-1 sm:flex-none items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? "Saving..." : "Save"}</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex flex-1 sm:flex-none items-center justify-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1 p-6">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center mx-auto">
              <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>

            {!isEditing ? (
              <>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {profile.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {profile.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {profile.company}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatJoinDate(profile.joinDate)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center font-bold bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={editedProfile.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  value={editedProfile.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Personal Information
          </h3>

          <div className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 dark:text-white break-words">
                    {profile.name}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 dark:text-white break-words">
                    {profile.email}
                  </p>
                ) : (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 dark:text-white">
                    {profile.phone}
                  </p>
                ) : (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 dark:text-white">
                    {profile.location}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Title
                </label>
                {!isEditing ? (
                  <p className="text-gray-900 dark:text-white">
                    {profile.title}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={editedProfile.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              {!isEditing ? (
                <p className="text-gray-900 dark:text-white">{profile.bio}</p>
              ) : (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interests
              </label>
              {!isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-300 rounded-full"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={editedProfile.interests.join(", ")}
                    onChange={(e) => handleInterestsChange(e.target.value)}
                    placeholder="Enter interests separated by commas"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Separate interests with commas
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            68%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Profile Complete
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            12
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Skills Learned
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            8
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Events Attended
          </div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            24
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            AI Sessions
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

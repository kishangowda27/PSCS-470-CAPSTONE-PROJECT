import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";

const Onboarding = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    interests: "",
    bio: "",
    target_role: "",
  });

  useEffect(() => {
    if (userProfile) {
      setForm({
        title: userProfile.title || "",
        company: userProfile.company || "",
        location: userProfile.location || "",
        interests: Array.isArray(userProfile.interests)
          ? userProfile.interests.join(", ")
          : "",
        bio: userProfile.bio || "",
        target_role: userProfile.target_role || "",
      });
    }
  }, [userProfile]);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSaving(true);
      setError("");
      const updates = {
        title: form.title,
        company: form.company,
        location: form.location,
        bio: form.bio,
        interests: form.interests
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        target_role: form.target_role,
      };
      const { error: err } = await updateProfile(updates);
      if (err) {
        setError(err.message || "Failed to save");
        return;
      }
      window.history.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tell us about you
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          We’ll use this to personalize your dashboard and AI guidance.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Current title
              </label>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Company (optional)
              </label>
              <input
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Target role
              </label>
              <input
                value={form.target_role}
                onChange={(e) => handleChange("target_role", e.target.value)}
                placeholder="e.g., Data Scientist, Frontend Engineer"
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Interests (comma-separated)
            </label>
            <input
              value={form.interests}
              onChange={(e) => handleChange("interests", e.target.value)}
              placeholder="AI, React, Product Design"
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
              Short bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700"
            >
              {saving ? "Saving..." : "Save and continue"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Onboarding;

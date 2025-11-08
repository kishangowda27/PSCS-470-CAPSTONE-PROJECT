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
        let errorMessage = err.message || "Failed to save";
        
        // Provide helpful message for missing column error
        if (errorMessage.includes("target_role") || errorMessage.includes("schema cache")) {
          errorMessage = "Database setup required: The 'target_role' column is missing. Please run this SQL in Supabase Dashboard (SQL Editor):\n\nALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS target_role text DEFAULT '';\n\nSee FIX_TARGET_ROLE.md for step-by-step instructions.";
        }
        
        setError(errorMessage);
        console.error("Profile update error:", err);
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
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                    Setup Required
                  </h3>
                  <div className="text-sm text-red-700 dark:text-red-300 whitespace-pre-line">
                    {error}
                  </div>
                  {error.includes("target_role") && (
                    <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-red-200 dark:border-red-700">
                      <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                        ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS target_role text DEFAULT '';
                      </p>
                    </div>
                  )}
                </div>
              </div>
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

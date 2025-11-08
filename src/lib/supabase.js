import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://tinuezapdkjodzaxfxui.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbnVlemFwZGtqb2R6YXhmeHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzY1NjgsImV4cCI6MjA3NDA1MjU2OH0.zEzJi7qQ0YbGEIg5gbCDoE0cJiIItJXfSsDvO7zR0q0";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  signUp: async (email, password, userData = {}) => {
    // Sign up user - Supabase will automatically send verification email
    // Make sure email confirmation is enabled in Supabase dashboard
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/dashboard`, // Redirect after email confirmation
        },
      });
      
      // Log for debugging
      if (error) {
        console.error("Supabase sign up error:", error);
      } else {
        console.log("Sign up successful, user created:", data.user?.id);
      }
      
      return { data, error };
    } catch (err) {
      console.error("Sign up exception:", err);
      return { data: null, error: err };
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Forgot password - sends OTP to email
  resetPasswordForEmail: async (email) => {
    // Use signInWithOtp to send OTP code for password recovery
    // This will send a 6-digit OTP code to the user's email
    // Note: Supabase email templates must be configured to show OTP codes
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Don't create user if doesn't exist
        // This ensures OTP is sent instead of magic link
        // The email template in Supabase dashboard should display {{ .Token }} for OTP
      },
    });
    return { data, error };
  },

  // Verify OTP and update password
  updatePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  // Verify OTP token
  verifyOtp: async (email, token, type = "email") => {
    // Verify OTP code - use 'email' type for OTP verification
    // After verification, user will be signed in and can reset password
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email", // Always use 'email' type for OTP verification
    });
    return { data, error };
  },
};

// Database helper functions
export const db = {
  // User profiles
  createUserProfile: async (userId, profileData) => {
    try {
      console.log("Creating user profile for:", userId, profileData);
      
      const { data, error } = await supabase
        .from("user_profiles")
        .insert([{ user_id: userId, ...profileData }])
        .select()
        .single();

      if (error) {
        console.error("Profile creation error:", error);
        // If profile already exists, try to update it
        if (error.code === "23505") {
          // Unique violation - profile already exists
          console.log("Profile already exists, updating...");
          const { data: updateData, error: updateError } = await supabase
            .from("user_profiles")
            .update(profileData)
            .eq("user_id", userId)
            .select()
            .single();
          
          if (updateError) {
            console.error("Profile update error:", updateError);
          }
          return { data: updateData, error: updateError };
        }
        return { data: null, error };
      }
      
      console.log("Profile created successfully:", data);
      return { data, error: null };
    } catch (err) {
      console.error("Profile creation exception:", err);
      return { data: null, error: err };
    }
  },

  getUserProfile: async (userId) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data, error };
  },

  updateUserProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("user_id", userId);
    return { data, error };
  },

  // Chat messages
  saveChatMessage: async (userId, message, sender) => {
    const { data, error } = await supabase.from("chat_messages").insert([
      {
        user_id: userId,
        message,
        sender,
        timestamp: new Date().toISOString(),
      },
    ]);
    return { data, error };
  },

  getChatHistory: async (userId) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: true });
    return { data, error };
  },

  // User skills
  saveUserSkill: async (userId, skillData) => {
    const { data, error } = await supabase
      .from("user_skills")
      .upsert([{ user_id: userId, ...skillData }]);
    return { data, error };
  },

  getUserSkills: async (userId) => {
    const { data, error } = await supabase
      .from("user_skills")
      .select("*")
      .eq("user_id", userId);
    return { data, error };
  },

  // Career goals
  saveCareerGoal: async (userId, goalData) => {
    const { data, error } = await supabase
      .from("career_goals")
      .upsert([{ user_id: userId, ...goalData }]);
    return { data, error };
  },

  getCareerGoals: async (userId) => {
    const { data, error } = await supabase
      .from("career_goals")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    return { data, error };
  },

  // Get recent chat messages (for activity)
  getRecentChatMessages: async (userId, limit = 10) => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Get user skills with progress
  getUserSkillsWithProgress: async (userId) => {
    const { data, error } = await supabase
      .from("user_skills")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    return { data, error };
  },
};

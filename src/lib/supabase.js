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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
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
};

// Database helper functions
export const db = {
  // User profiles
  createUserProfile: async (userId, profileData) => {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert([{ user_id: userId, ...profileData }]);
    return { data, error };
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
      .eq("user_id", userId);
    return { data, error };
  },
};

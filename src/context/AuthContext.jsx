import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase, auth, db } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Do not block UI on profile load
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Fire and forget to avoid blocking the UI
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await db.getUserProfile(userId);
      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error loading user profile:", error);
        return;
      }

      // If no profile exists, create a starter profile now that the user is authenticated
      if (!data) {
        const starter = {
          name: user?.email?.split("@")[0] || "",
          email: user?.email || "",
          created_at: new Date().toISOString(),
        };
        const { error: createErr } = await db.createUserProfile(
          userId,
          starter
        );
        if (createErr) {
          console.error("Error creating starter profile:", createErr);
          return;
        }
        setUserProfile({ user_id: userId, ...starter });
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signUp(email, password, userData);

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const profileData = {
          name: userData.name || "",
          email: email,
          created_at: new Date().toISOString(),
        };

        await db.createUserProfile(data.user.id, profileData);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signIn(email, password);
      if (!error && data?.user) {
        // Ensure profile exists right after login
        await loadUserProfile(data.user.id);
      }
      return { data, error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signOut();
      if (!error) {
        setUser(null);
        setUserProfile(null);
      }
      return { error };
    } catch (error) {
      console.error("Sign out error:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error("No user logged in") };

    try {
      // Only allow columns that exist to avoid schema errors
      const allowedKeys = new Set([
        "name",
        "email",
        "phone",
        "location",
        "title",
        "company",
        "bio",
        "interests",
      ]);
      const safeUpdates = Object.fromEntries(
        Object.entries(updates).filter(([k]) => allowedKeys.has(k))
      );

      const { data, error } = await db.updateUserProfile(user.id, safeUpdates);
      if (!error) {
        setUserProfile((prev) => ({ ...prev, ...safeUpdates }));
      }
      return { data, error };
    } catch (error) {
      console.error("Update profile error:", error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    loadUserProfile: () => (user ? loadUserProfile(user.id) : null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

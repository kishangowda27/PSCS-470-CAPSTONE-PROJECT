import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState("email"); // 'email', 'otp', 'reset'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {
    user,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    verifyOtp,
    resetPassword,
  } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
    if (success) setSuccess(""); // Clear success when user starts typing
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (forgotPasswordStep === "email") {
        if (!formData.email) {
          setError("Please enter your email address");
          setLoading(false);
          return;
        }
        const { error } = await forgotPassword(formData.email);
        if (error) {
          setError(
            error.message || "Failed to send reset email. Please try again."
          );
        } else {
          setSuccess(
            "OTP code sent to your email! Please check your inbox for the 6-digit code."
          );
          setForgotPasswordStep("otp");
        }
      } else if (forgotPasswordStep === "otp") {
        if (!formData.otp) {
          setError("Please enter the OTP code");
          setLoading(false);
          return;
        }
        if (formData.otp.length !== 6) {
          setError("OTP code must be 6 digits");
          setLoading(false);
          return;
        }
        const { data, error } = await verifyOtp(formData.email, formData.otp);
        if (error) {
          setError(error.message || "Invalid OTP code. Please try again.");
        } else {
          setSuccess(
            "OTP verified successfully! Please enter your new password."
          );
          setForgotPasswordStep("reset");
        }
      } else if (forgotPasswordStep === "reset") {
        if (!formData.password) {
          setError("Please enter a new password");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long");
          setLoading(false);
          return;
        }
        const { error } = await resetPassword(formData.password);
        if (error) {
          setError(
            error.message || "Failed to reset password. Please try again."
          );
        } else {
          setSuccess("Password reset successfully! Redirecting to login...");
          // Sign out the user after password reset so they can log in with new password
          setTimeout(async () => {
            await signOut();
            setShowForgotPassword(false);
            setForgotPasswordStep("email");
            setFormData({
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              otp: "",
            });
            setIsLogin(true);
          }, 2000);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message);
        } else if (data.user) {
          navigate("/dashboard");
        }
      } else {
        if (!formData.name.trim()) {
          setError("Please enter your full name");
          return;
        }

        const { data, error } = await signUp(
          formData.email,
          formData.password,
          {
            name: formData.name,
          }
        );

        if (error) {
          console.error("Sign up error in Login page:", error);
          // Show more detailed error message
          let errorMessage = error.message || "Failed to create account. Please try again.";
          
          // Handle specific error cases
          if (error.message?.includes("already registered")) {
            errorMessage = "This email is already registered. Please sign in instead.";
          } else if (error.message?.includes("password")) {
            errorMessage = "Password is too weak. Please use a stronger password.";
          } else if (error.message?.includes("email")) {
            errorMessage = "Invalid email address. Please check and try again.";
          }
          
          setError(errorMessage);
        } else {
          // Show success message for sign up
          setSuccess(
            "Account created successfully! A verification email has been sent to your email address. Please check your inbox (and spam folder) to verify your account before signing in."
          );
          setError("");
          setIsLogin(true);
          // Clear form data
          setFormData({ ...formData, name: "", email: "", password: "" });
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password View
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              {forgotPasswordStep === "email" && "Reset Password"}
              {forgotPasswordStep === "otp" && "Enter OTP Code"}
              {forgotPasswordStep === "reset" && "Set New Password"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {forgotPasswordStep === "email" &&
                "Enter your email to receive a password reset code"}
              {forgotPasswordStep === "otp" &&
                "Enter the OTP code sent to your email"}
              {forgotPasswordStep === "reset" && "Enter your new password"}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {error && (
                <div className="mb-4 p-3 rounded-lg text-sm bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-lg text-sm bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                {forgotPasswordStep === "email" && (
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <input
                      id="reset-email"
                      name="reset-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter your email"
                    />
                  </div>
                )}

                {forgotPasswordStep === "otp" && (
                  <div>
                    <label
                      htmlFor="otp"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      OTP Code
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      value={formData.otp}
                      onChange={(e) =>
                        handleInputChange(
                          "otp",
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      required
                      maxLength={6}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Check your email for the 6-digit code
                    </p>
                  </div>
                )}

                {forgotPasswordStep === "reset" && (
                  <>
                    <div>
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        New Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="new-password"
                          name="new-password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                          className="block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Confirm Password
                      </label>
                      <div className="mt-1 relative">
                        <input
                          id="confirm-password"
                          name="confirm-password"
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          required
                          className="block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>
                      {forgotPasswordStep === "email" && "Sending..."}
                      {forgotPasswordStep === "otp" && "Verifying..."}
                      {forgotPasswordStep === "reset" && "Resetting..."}
                    </span>
                  </div>
                ) : (
                  <>
                    {forgotPasswordStep === "email" && "Send Reset Code"}
                    {forgotPasswordStep === "otp" && "Verify OTP"}
                    {forgotPasswordStep === "reset" && "Reset Password"}
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-between">
                {forgotPasswordStep !== "email" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (forgotPasswordStep === "otp") {
                        setForgotPasswordStep("email");
                        setFormData({ ...formData, otp: "" });
                      } else if (forgotPasswordStep === "reset") {
                        setForgotPasswordStep("otp");
                        setFormData({
                          ...formData,
                          password: "",
                          confirmPassword: "",
                        });
                      }
                      setError("");
                      setSuccess("");
                    }}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordStep("email");
                    setFormData({
                      ...formData,
                      password: "",
                      confirmPassword: "",
                      otp: "",
                    });
                    setError("");
                    setSuccess("");
                  }}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isLogin
              ? "Welcome back to CareerGuide"
              : "Start your career journey today"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {(error || success) && (
              <div
                className={`mb-4 p-3 rounded-lg text-sm ${
                  success || error.includes("successfully")
                    ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                {success || error}
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required={!isLogin}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    className="block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary-600 hover:text-primary-500"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </span>
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                disabled={loading}
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

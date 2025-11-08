import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import {
  TrendingUp,
  Target,
  Calendar,
  MessageCircle,
  Users,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const rawName = (userProfile?.name || "").trim();
  const isPlaceholder = !rawName || rawName.toLowerCase() === "your name";
  const displayName = isPlaceholder
    ? user?.user_metadata?.name || user?.email?.split("@")[0] || "User"
    : rawName;

  const stats = [
    {
      icon: Target,
      label: "Skills Completed",
      value: "12",
      change: "+3 this month",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: TrendingUp,
      label: "Career Progress",
      value: "68%",
      change: "+12% this month",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Calendar,
      label: "Events Attended",
      value: "8",
      change: "+2 this month",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: MessageCircle,
      label: "AI Sessions",
      value: "24",
      change: "+5 this week",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  const quickActions = [
    {
      icon: Target,
      title: "Skill Assessment",
      description: "Take a quick skill assessment",
      link: "/skills",
      color: "bg-blue-500",
    },
    {
      icon: MessageCircle,
      title: "Ask AI Advisor",
      description: "Get personalized career advice",
      link: "/chat",
      color: "bg-green-500",
    },
    {
      icon: Calendar,
      title: "Browse Events",
      description: "Find networking opportunities",
      link: "/events",
      color: "bg-purple-500",
    },
    {
      icon: Users,
      title: "Find Mentors",
      description: "Connect with industry experts",
      link: "/events",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Welcome back, {displayName}! 👋
        </h1>
        <p className="text-primary-100">
          {userProfile?.target_role
            ? `Ready to advance your career? Let's continue your journey towards becoming a ${userProfile.target_role}.`
            : "Tell us your interests and target role to personalize your plan."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {(!userProfile?.interests?.length || !userProfile?.title) && (
              <Link
                to="/onboarding"
                className="flex items-center space-x-4 p-4 rounded-lg bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-300 dark:border-primary-700 hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-all shadow-sm"
              >
                <div className="w-12 h-12 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-1">
                    Complete your profile
                  </h3>
                  <p className="text-sm text-primary-700 dark:text-primary-300 leading-relaxed">
                    Add interests and your target role so we can personalize your journey and provide better career recommendations.
                  </p>
                </div>
              </Link>
            )}
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div
                    className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Completed "Python Fundamentals" course
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Attended "AI Career Fair 2025"
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  1 day ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Started mentorship with Sarah Chen
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  3 days ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Updated career goal to "Data Scientist"
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  1 week ago
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Career Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Career Journey Progress
          </h2>
          <Award className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Data Science Skills
              </span>
              <span className="text-gray-600 dark:text-gray-400">68%</span>
            </div>
            <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Networking & Experience
              </span>
              <span className="text-gray-600 dark:text-gray-400">45%</span>
            </div>
            <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: "45%" }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Portfolio & Projects
              </span>
              <span className="text-gray-600 dark:text-gray-400">30%</span>
            </div>
            <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

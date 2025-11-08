import React, { useEffect, useState } from "react";
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
import { db } from "../lib/supabase";

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const [skills, setSkills] = useState([]);
  const [careerGoals, setCareerGoals] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const rawName = (userProfile?.name || "").trim();
  const isPlaceholder = !rawName || rawName.toLowerCase() === "your name";
  const displayName = isPlaceholder
    ? user?.user_metadata?.name || user?.email?.split("@")[0] || "User"
    : rawName;

  // Format time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all user data in parallel
        const [skillsData, goalsData, messagesData] = await Promise.all([
          db.getUserSkillsWithProgress(user.id),
          db.getCareerGoals(user.id),
          db.getRecentChatMessages(user.id, 20),
        ]);

        if (skillsData.data) setSkills(skillsData.data);
        if (goalsData.data) setCareerGoals(goalsData.data);
        if (messagesData.data) setChatMessages(messagesData.data);

        // Build recent activity from various sources
        const activities = [];
        
        // Add chat messages as activities
        if (messagesData.data) {
          const userMessages = messagesData.data.filter(msg => msg.sender === 'user').slice(0, 3);
          userMessages.forEach(msg => {
            activities.push({
              type: 'chat',
              message: 'Had AI career guidance session',
              timestamp: msg.timestamp,
              color: 'bg-orange-500',
            });
          });
        }

        // Add skill completions/updates
        if (skillsData.data) {
          const recentSkills = skillsData.data
            .filter(skill => skill.is_completed || skill.updated_at)
            .slice(0, 3);
          recentSkills.forEach(skill => {
            if (skill.is_completed) {
              activities.push({
                type: 'skill',
                message: `Completed "${skill.skill_name}" skill`,
                timestamp: skill.updated_at,
                color: 'bg-green-500',
              });
            } else if (skill.progress > 0) {
              activities.push({
                type: 'skill',
                message: `Updated progress on "${skill.skill_name}" (${skill.progress}%)`,
                timestamp: skill.updated_at,
                color: 'bg-blue-500',
              });
            }
          });
        }

        // Add career goal updates
        if (goalsData.data) {
          const recentGoals = goalsData.data.slice(0, 2);
          recentGoals.forEach(goal => {
            activities.push({
              type: 'goal',
              message: goal.target_role 
                ? `Updated career goal: ${goal.target_role}`
                : `Updated career goal: ${goal.goal_title}`,
              timestamp: goal.updated_at,
              color: 'bg-purple-500',
            });
          });
        }

        // Add profile update if recent
        if (userProfile?.updated_at) {
          const profileUpdateDate = new Date(userProfile.updated_at);
          const daysSinceUpdate = Math.floor((new Date() - profileUpdateDate) / (1000 * 60 * 60 * 24));
          if (daysSinceUpdate < 7) {
            activities.push({
              type: 'profile',
              message: 'Updated profile information',
              timestamp: userProfile.updated_at,
              color: 'bg-indigo-500',
            });
          }
        }

        // Sort by timestamp and take most recent
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecentActivity(activities.slice(0, 6));

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id, userProfile?.updated_at]);

  // Calculate stats from real data
  const completedSkills = skills.filter(skill => skill.is_completed).length;
  const totalSkills = skills.length;
  const completedSkillsPercentage = totalSkills > 0 
    ? Math.round((completedSkills / totalSkills) * 100) 
    : 0;

  // Calculate career progress
  const calculateCareerProgress = () => {
    let progress = 0;
    let factors = 0;

    // Profile completion (30%)
    const profileFields = ['name', 'title', 'target_role', 'location', 'bio', 'interests'];
    const completedProfileFields = profileFields.filter(field => {
      if (field === 'interests') return userProfile?.interests?.length > 0;
      return userProfile?.[field] && userProfile[field] !== '';
    }).length;
    progress += (completedProfileFields / profileFields.length) * 30;
    factors += 1;

    // Skills progress (40%)
    if (totalSkills > 0) {
      const avgSkillProgress = skills.reduce((sum, skill) => sum + (skill.progress || 0), 0) / totalSkills;
      progress += (avgSkillProgress / 100) * 40;
      factors += 1;
    }

    // Career goals (30%)
    if (careerGoals.length > 0) {
      const avgGoalProgress = careerGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / careerGoals.length;
      progress += (avgGoalProgress / 100) * 30;
      factors += 1;
    }

    return factors > 0 ? Math.round(progress / factors) : 0;
  };

  const careerProgress = calculateCareerProgress();

  // Calculate skill category progress
  const getSkillCategoryProgress = (category) => {
    const categorySkills = skills.filter(skill => 
      skill.category?.toLowerCase() === category.toLowerCase()
    );
    if (categorySkills.length === 0) return 0;
    const avgProgress = categorySkills.reduce((sum, skill) => sum + (skill.progress || 0), 0) / categorySkills.length;
    return Math.round(avgProgress);
  };

  // Get top skill categories
  const getTopSkillCategories = () => {
    const categoryMap = {};
    skills.forEach(skill => {
      const category = skill.category || 'General';
      if (!categoryMap[category]) {
        categoryMap[category] = { skills: [], totalProgress: 0 };
      }
      categoryMap[category].skills.push(skill);
      categoryMap[category].totalProgress += skill.progress || 0;
    });

    return Object.entries(categoryMap)
      .map(([category, data]) => ({
        category,
        progress: Math.round(data.totalProgress / data.skills.length),
        skillCount: data.skills.length,
      }))
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);
  };

  const topCategories = getTopSkillCategories();

  // Calculate unique AI sessions (count unique days with chat messages)
  const uniqueChatDays = new Set(
    chatMessages
      .filter(msg => msg.sender === 'user')
      .map(msg => new Date(msg.timestamp).toDateString())
  ).size;

  // Calculate stats with real data
  const stats = [
    {
      icon: Target,
      label: "Skills Tracked",
      value: totalSkills || "0",
      change: completedSkills > 0 ? `${completedSkills} completed` : "Start adding skills",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: TrendingUp,
      label: "Career Progress",
      value: `${careerProgress}%`,
      change: careerGoals.length > 0 
        ? `${careerGoals.length} goal${careerGoals.length > 1 ? 's' : ''} set`
        : "Set your career goals",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Calendar,
      label: "Career Goals",
      value: careerGoals.length || "0",
      change: careerGoals.length > 0 
        ? `${careerGoals.filter(g => g.status === 'active').length} active`
        : "Create your first goal",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: MessageCircle,
      label: "AI Sessions",
      value: uniqueChatDays || "0",
      change: chatMessages.length > 0 
        ? `${chatMessages.filter(m => m.sender === 'user').length} messages`
        : "Start chatting with AI",
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
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-3 animate-pulse">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                No recent activity yet
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                Start by completing your profile, adding skills, or chatting with AI
              </p>
            </div>
          )}
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
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between text-sm mb-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2"></div>
              </div>
            ))}
          </div>
        ) : topCategories.length > 0 || careerGoals.length > 0 || userProfile ? (
          <div className="space-y-4">
            {/* Profile Completion */}
            {userProfile && (
              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Profile Completion
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {Math.round(
                      (['name', 'title', 'target_role', 'location', 'bio', 'interests']
                        .filter(field => {
                          if (field === 'interests') return userProfile?.interests?.length > 0;
                          return userProfile?.[field] && userProfile[field] !== '';
                        }).length / 6) * 100
                    )}%
                  </span>
                </div>
                <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ 
                      width: `${Math.round(
                        (['name', 'title', 'target_role', 'location', 'bio', 'interests']
                          .filter(field => {
                            if (field === 'interests') return userProfile?.interests?.length > 0;
                            return userProfile?.[field] && userProfile[field] !== '';
                          }).length / 6) * 100
                      )}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Top Skill Categories */}
            {topCategories.map((category, index) => {
              const colors = ['bg-primary-600', 'bg-green-600', 'bg-orange-600'];
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {category.category} Skills ({category.skillCount} skill{category.skillCount !== 1 ? 's' : ''})
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{category.progress}%</span>
                  </div>
                  <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`${colors[index % colors.length]} h-2 rounded-full`}
                      style={{ width: `${category.progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {/* Career Goals Progress */}
            {careerGoals.length > 0 && (
              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Career Goals Progress
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {Math.round(
                      careerGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / careerGoals.length
                    )}%
                  </span>
                </div>
                <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ 
                      width: `${Math.round(
                        careerGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / careerGoals.length
                      )}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Show message if no data */}
            {topCategories.length === 0 && careerGoals.length === 0 && !userProfile && (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Start building your career journey by adding skills and setting goals
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              No progress data yet
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">
              Complete your profile, add skills, and set career goals to track your progress
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;

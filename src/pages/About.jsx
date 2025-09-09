import React from 'react';
import Card from '../components/Card';
import { Target, Users, Lightbulb, Award, Heart, Globe } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Target,
      title: 'AI-Powered Guidance',
      description: 'Get personalized career recommendations powered by advanced machine learning algorithms that understand your unique skills and goals.'
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Connect with industry professionals and experienced mentors who can provide real-world insights and guidance for your career journey.'
    },
    {
      icon: Lightbulb,
      title: 'Skill Development',
      description: 'Access curated learning paths and skill recommendations tailored to your career aspirations and current market demands.'
    },
    {
      icon: Award,
      title: 'Career Tracking',
      description: 'Monitor your progress with detailed analytics and milestone tracking to stay motivated and on track towards your goals.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '1000+', label: 'Career Paths' },
    { number: '500+', label: 'Expert Mentors' },
    { number: '95%', label: 'Success Rate' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former Google executive with 15+ years in tech leadership and talent development.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'AI researcher and former Microsoft engineer specializing in machine learning and data science.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'Product strategist with a passion for creating user-centered experiences in career development.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'David Park',
      role: 'Head of AI',
      bio: 'PhD in Machine Learning with expertise in natural language processing and recommendation systems.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About CareerGuide AI</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Empowering professionals to navigate their career journey with AI-powered insights, 
          expert mentorship, and personalized guidance.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="p-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700">
        <div className="text-center space-y-4">
          <Heart className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            To democratize career development by providing everyone with access to personalized, 
            AI-powered career guidance that was previously only available to the privileged few.
          </p>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{stat.number}</div>
            <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What We Offer</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our comprehensive platform combines cutting-edge AI technology with human expertise 
            to provide you with everything you need for career success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Team */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our diverse team of experts combines deep industry knowledge with cutting-edge 
            technology to help you achieve your career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="p-6 text-center">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Company Values */}
      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Values</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Accessibility</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Making career development tools accessible to everyone, regardless of background or resources.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Continuously pushing the boundaries of what's possible with AI and career development.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Empathy</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Understanding that career transitions are personal journeys that require support and guidance.
            </p>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Career?</h2>
        <p className="text-primary-100 mb-6">
          Join thousands of professionals who have accelerated their careers with our AI-powered platform.
        </p>
        <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Get Started Today
        </button>
      </Card>
    </div>
  );
};

export default About;

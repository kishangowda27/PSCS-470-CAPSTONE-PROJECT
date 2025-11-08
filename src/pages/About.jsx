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
    { number: 'Growing', label: 'Community' },
    { number: '100+', label: 'Career Paths' },
    { number: 'Expanding', label: 'Resources' },
    { number: 'New', label: 'Platform' }
  ];


  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">About CareerGuide AI</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          A new platform empowering professionals to navigate their career journey with AI-powered insights, 
          expert mentorship, and personalized guidance. This is just the beginning of our journey.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="p-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700">
        <div className="text-center space-y-4">
          <Heart className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            As a new project, our mission is to democratize career development by providing everyone 
            with access to personalized, AI-powered career guidance. We're just getting started, and 
            we're excited to build this platform alongside our community of users.
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Journey</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're a new project focused on building a comprehensive career guidance platform. 
            Our team is passionate about helping professionals achieve their career goals through 
            innovative technology and personalized support.
          </p>
        </div>

        <Card className="p-8 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              This is just the beginning of our journey. We're continuously working to improve 
              the platform, add new features, and build a community of professionals who are 
              passionate about career growth and development.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              As we grow, we'll be expanding our team, resources, and capabilities to better 
              serve our users and help them achieve their career aspirations.
            </p>
          </div>
        </Card>
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
          Join us on this journey as we build a comprehensive career guidance platform. 
          Be part of our growing community and help shape the future of career development.
        </p>
        <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Get Started Today
        </button>
      </Card>
    </div>
  );
};

export default About;

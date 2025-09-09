import React, { useState } from 'react';
import Card from '../components/Card';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Users } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours',
      contact: 'support@careerguide.ai',
      action: 'mailto:support@careerguide.ai'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our support team directly',
      contact: '+91 98765 43210',
      action: 'tel:+919876543210'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our AI assistant or support team',
      contact: 'Available 24/7',
      action: '/chat'
    }
  ];

  const faqs = [
    {
      question: 'How does the AI career guidance work?',
      answer: 'Our AI analyzes your skills, experience, and career goals to provide personalized recommendations and guidance tailored to your unique situation.'
    },
    {
      question: 'Is the platform free to use?',
      answer: 'We offer both free and premium plans. The free plan includes basic features, while premium unlocks advanced AI guidance and mentor connections.'
    },
    {
      question: 'How do I connect with mentors?',
      answer: 'Browse our mentor directory, filter by expertise and availability, then book a session directly through the platform.'
    },
    {
      question: 'Can I use this if I\'m just starting my career?',
      answer: 'Absolutely! Our platform is designed for professionals at all stages, from students to executives looking to make career transitions.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have questions about your career journey? We're here to help! Reach out to our team 
          and we'll get back to you as soon as possible.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <Card key={index} className="p-6 text-center" hover>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{method.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{method.description}</p>
              <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">{method.contact}</p>
              <button 
                onClick={() => method.action.startsWith('/') ? window.location.href = method.action : window.location.href = method.action}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm"
              >
                Get in Touch
              </button>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subject *
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership Opportunity</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Message *
              </label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </button>
          </form>
        </Card>

        {/* FAQ & Office Info */}
        <div className="space-y-6">
          {/* Office Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Our Office</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Headquarters</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    123 Innovation Drive<br />
                    Bengaluru, KA 560001<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Business Hours</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                    Weekend: Emergency support only
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Support Team</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Our dedicated support team is here to help you succeed in your career journey.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Response Time Notice */}
      <Card className="p-6 bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/30">
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <div>
            <h3 className="font-medium text-primary-900 dark:text-primary-200">Response Time</h3>
            <p className="text-primary-700 dark:text-primary-300 text-sm">
              We typically respond to all inquiries within 24 hours during business days. 
              For urgent matters, please call our support line directly.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Contact;

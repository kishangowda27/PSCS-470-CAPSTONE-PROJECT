import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/Card';
import ChatMessage from '../components/ChatMessage';
import { Send, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/supabase';
import { openRouterAPI } from '../lib/openrouter';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { user, userProfile } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await db.getChatHistory(user.id);
      if (error) {
        console.error('Error loading chat history:', error);
        // Set default welcome message if no history
        setMessages([{
          id: 1,
          message: "Hello! I'm your AI career advisor. How can I help you today?",
          sender: 'ai',
          timestamp: new Date().toISOString()
        }]);
      } else if (data && data.length > 0) {
        setMessages(data);
      } else {
        // Set default welcome message if no history
        setMessages([{
          id: 1,
          message: "Hello! I'm your AI career advisor. How can I help you today?",
          sender: 'ai',
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    sendMessage(newMessage);
  };

  const sendMessage = async (messageText) => {
    setLoading(true);

    // Add user message
    const userMessage = {
      id: Date.now(),
      message: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to database
    if (user) {
      await db.saveChatMessage(user.id, messageText, 'user');
    }
    
    setNewMessage('');

    try {
      // Get AI response using OpenRouter
      const response = await openRouterAPI.generateCareerAdvice(
        userProfile || { name: user?.email || 'User' },
        messageText
      );

      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          message: response.message,
          sender: 'ai',
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Save AI message to database
        if (user) {
          await db.saveChatMessage(user.id, response.message, 'ai');
        }
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        message: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "How do I transition to a tech career?",
    "What skills should I learn for data science?",
    "Can you help me improve my resume?",
    "What are the highest paying remote jobs?"
  ];

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Career Guidance</h1>
          <p className="text-gray-600 dark:text-gray-400">Get personalized career advice from our AI advisor</p>
        </div>
        <Card className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your chat history...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Career Guidance</h1>
        <p className="text-gray-600 dark:text-gray-400">Get personalized career advice from our AI advisor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-3 flex flex-col h-[75vh]">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Career Advisor</h3>
                <p className="text-sm text-green-600 dark:text-green-400">Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                message={message.message}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))}
            {loading && (
              <div className="flex space-x-3 justify-start mb-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={loading}
                placeholder="Ask me anything about your career..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !newMessage.trim()}
                className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Questions */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Questions</h3>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => !loading && sendMessage(question)}
                  disabled={loading}
                  className="w-full text-left p-2 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-gray-800 dark:text-gray-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </Card>

          {/* AI Features */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">AI Features</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Career Path Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Skill Recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Resume Optimization</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Interview Prep</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;

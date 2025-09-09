import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/Card';
import ChatMessage from '../components/ChatMessage';
import { Send, Bot } from 'lucide-react';
import chatData from '../data/chat.json';

const Chat = () => {
  const [messages, setMessages] = useState(chatData);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      message: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! Let me help you with that. Based on your current skills and goals, I'd recommend focusing on...",
        "I understand what you're looking for. Here are some personalized recommendations that align with your career path...",
        "Excellent choice! This is a growing field with many opportunities. Let me break down the key steps you should take...",
        "I can definitely help you with that career transition. Based on industry trends and your background, here's what I suggest..."
      ];

      const aiMessage = {
        id: messages.length + 2,
        message: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const suggestedQuestions = [
    "How do I transition to a tech career?",
    "What skills should I learn for data science?",
    "Can you help me improve my resume?",
    "What are the highest paying remote jobs?"
  ];

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
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me anything about your career..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                type="submit"
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
                  onClick={() => setNewMessage(question)}
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

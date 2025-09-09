import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message, sender, timestamp }) => {
  const isAI = sender === 'ai';
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex space-x-3 ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-md ${isAI ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : 'bg-primary-500 text-white'} rounded-lg px-4 py-2`}>
        <p className="text-sm whitespace-pre-line">{message}</p>
        <p className={`text-xs mt-1 ${isAI ? 'text-gray-500 dark:text-gray-400' : 'text-primary-100'}`}>
          {formatTime(timestamp)}
        </p>
      </div>
      
      {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

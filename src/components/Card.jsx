import React from 'react';

const Card = ({ children, className = '', hover = false }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
        hover ? 'hover:shadow-md dark:hover:border-gray-600 transition-all duration-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

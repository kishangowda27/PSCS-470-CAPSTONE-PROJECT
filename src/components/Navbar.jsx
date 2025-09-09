import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-40">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">CareerGuide</span>
          </Link>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <button className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <Link to="/profile" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-500/20 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">John Doe</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

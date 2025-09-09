import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Target, 
  MessageCircle, 
  Calendar, 
  User, 
  Info, 
  Mail,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/careers', icon: MapPin, label: 'Career Pathways' },
    { path: '/skills', icon: Target, label: 'Skill Recommendations' },
    { path: '/chat', icon: MessageCircle, label: 'AI Guidance' },
    { path: '/events', icon: Calendar, label: 'Events & Mentorship' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/about', icon: Info, label: 'About Us' },
    { path: '/contact', icon: Mail, label: 'Contact' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 z-50
                 transform transition-transform duration-300 ease-in-out
                 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                 lg:translate-x-0 lg:shadow-sm lg:z-30`}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CareerGuide</span>
        </Link>
        <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose} // Close sidebar on mobile navigation
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

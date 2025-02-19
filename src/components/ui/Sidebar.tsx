'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  LogOut,
  User
} from 'lucide-react';

const mainMenuItems = [
  {
    title: 'Home',
    icon: Home,
    path: '/internal/dashboard'
  },
  {
    title: 'Clients',
    icon: Briefcase,
    path: '/internal/clients'
  },
  {
    title: 'Business',
    icon: Building2,
    path: '/internal/businesses'
  },
  {
    title: 'Users',
    icon: Users,
    path: '/internal/users'
  }
];

const adminMenuItems = [
  {
    title: 'Settings',
    icon: Settings,
    path: '/internal/settings'
  }
];

interface UserDropdownProps {
  isExpanded: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ isExpanded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const userName = "John Doe"; // This should come from your auth context
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  const dropdownItems = [
    { title: 'Edit Profile', icon: User, action: () => console.log('Edit profile') },
    { title: 'Logout', icon: LogOut, action: () => console.log('Logout') },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-1.5 flex items-center ${isExpanded ? 'px-2' : 'justify-center'} hover:bg-gray-100 rounded-lg transition-colors`}
      >
        <div className="w-7 h-7 rounded-full overflow-hidden bg-egyptian-blue/90 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-medium">{userInitials}</span>
        </div>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="ml-2 text-sm font-medium text-gray-700 truncate"
          >
            {userName}
          </motion.div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute bottom-full ${isExpanded ? 'w-full' : 'w-48'} ${!isExpanded ? '-right-2' : 'right-0'} mb-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden`}
          >
            {dropdownItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-1.5 flex items-center text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <item.icon className="w-3.5 h-3.5 text-gray-500" />
                <span className="ml-2 text-sm">{item.title}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const isAdmin = true; // This should come from your auth context

  const renderMenuItems = (items: typeof mainMenuItems) => {
    return items.map((item) => {
      const isActive = pathname === item.path;

      return (
        <Link
          key={item.path}
          href={item.path}
          className={`flex items-center px-2 py-1.5 rounded-lg mb-0.5 group transition-colors ${
            isActive
              ? 'bg-egyptian-blue/5 text-egyptian-blue'
              : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <item.icon className={`w-4 h-4 ${
            isActive ? 'text-egyptian-blue' : 'text-gray-400 group-hover:text-gray-500'
          }`} />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-2 text-sm font-medium"
              >
                {item.title}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      );
    });
  };

  return (
    <motion.div
      initial={{ width: isExpanded ? 220 : 56 }}
      animate={{ width: isExpanded ? 220 : 56 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm"
    >
      {/* Logo/Brand Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-7 h-7 rounded bg-egyptian-blue/90 flex items-center justify-center text-white font-bold text-sm">
            BM
          </div>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="ml-2 font-medium text-sm text-gray-900"
            >
              Business Manager
            </motion.div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-1.5 rounded-lg mx-2 mt-2 hover:bg-gray-100 transition-colors"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Main Navigation Items */}
      <nav className="flex-1 pt-1 px-2">
        {renderMenuItems(mainMenuItems)}

        {/* Admin Section */}
        {isAdmin && (
          <>
            {isExpanded && (
              <div className="mt-4 mb-1 px-2">
                <span className="text-xs font-medium text-gray-400 uppercase">Admin</span>
              </div>
            )}
            {renderMenuItems(adminMenuItems)}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="mt-auto border-t border-gray-100 p-2">
        <UserDropdown isExpanded={isExpanded} />
      </div>
    </motion.div>
  );
}

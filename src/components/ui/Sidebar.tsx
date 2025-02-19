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
  LayoutDashboard,
  Settings
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/internal/dashboard'
  },
  {
    title: 'Businesses',
    icon: Building2,
    path: '/internal/businesses'
  },
  {
    title: 'Users',
    icon: Users,
    path: '/internal/users'
  },
  {
    title: 'Clients',
    icon: Briefcase,
    path: '/internal/clients'
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/internal/settings'
  }
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ width: isExpanded ? 240 : 64 }}
      animate={{ width: isExpanded ? 240 : 64 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-white border-r border-gray-200 flex flex-col"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 rounded-lg mx-2 mt-2 hover:bg-gray-100 transition-colors"
      >
        {isExpanded ? (
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 pt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-3 py-2 mx-2 rounded-lg mb-1 group transition-colors ${
                isActive
                  ? 'bg-egyptian-blue text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                isActive ? 'text-white' : 'text-gray-500'
              }`} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 font-medium"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}

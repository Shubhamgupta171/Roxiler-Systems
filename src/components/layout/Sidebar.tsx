import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Store, 
  Star, 
  Settings, 
  BarChart3,
  UserPlus,
  Shield
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';
import { cn } from '../../utils/cn';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const adminNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/stores', icon: Store, label: 'Stores' },
    { to: '/add-user', icon: UserPlus, label: 'Add User' },
    { to: '/add-store', icon: Store, label: 'Add Store' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const userNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/stores', icon: Store, label: 'Stores' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const storeOwnerNavItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return adminNavItems;
      case UserRole.STORE_OWNER:
        return storeOwnerNavItems;
      default:
        return userNavItems;
    }
  };

  return (
    <div className="bg-white w-64 min-h-screen border-r border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">RateStore</h1>
            <p className="text-sm text-gray-500">Rating Platform</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        <div className="px-6 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500 capitalize">{user?.role.replace('_', ' ')}</span>
          </div>
        </div>

        <div className="space-y-1">
          {getNavItems().map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
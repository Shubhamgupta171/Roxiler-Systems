import React, { useState } from 'react';
import { Star, Shield, Users, BarChart3 } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">RateStore</h1>
              <p className="text-gray-600">Professional Rating Platform</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Rate, Review & Discover
              <br />
              <span className="text-blue-600">Amazing Stores</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-md">
              Join thousands of users in building a trusted community of store ratings and reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Secure</h3>
              <p className="text-sm text-gray-600">Role-based access control</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Community</h3>
              <p className="text-sm text-gray-600">Trusted user reviews</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Detailed insights</p>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex justify-center">
          {isLogin ? (
            <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};
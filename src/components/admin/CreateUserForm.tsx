import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { adminService } from '../../services/adminService';
import { UserRole } from '../../types/auth';
import { validateName, validateEmail, validateAddress, validatePassword } from '../../utils/validation';

interface CreateUserFormProps {
  onSuccess: () => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: UserRole.USER
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | UserRole) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const addressError = validateAddress(formData.address);
    const passwordError = validatePassword(formData.password);

    const newErrors: Record<string, string> = {};
    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (addressError) newErrors.address = addressError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await adminService.createUser(formData);
      onSuccess();
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Failed to create user' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <Input
        type="text"
        label="Full Name"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        error={errors.name}
        placeholder="Enter full name (20-60 characters)"
        helperText="Must be between 20 and 60 characters"
      />

      <Input
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        placeholder="Enter email address"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter address (max 400 characters)"
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address}</p>
        )}
        <p className="text-sm text-gray-500">
          {formData.address.length}/400 characters
        </p>
      </div>

      <Input
        type="password"
        label="Password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        error={errors.password}
        placeholder="Create a password"
        helperText="8-16 characters, must include uppercase letter and special character"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={UserRole.USER}>User</option>
          <option value={UserRole.STORE_OWNER}>Store Owner</option>
          <option value={UserRole.ADMIN}>Admin</option>
        </select>
      </div>

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create User
        </Button>
      </div>
    </form>
  );
};
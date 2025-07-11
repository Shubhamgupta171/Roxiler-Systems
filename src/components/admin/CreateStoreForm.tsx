import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { adminService } from '../../services/adminService';
import { validateEmail } from '../../utils/validation';

interface CreateStoreFormProps {
  onSuccess: () => void;
}

export const CreateStoreForm: React.FC<CreateStoreFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Store name is required';
    } else if (formData.name.length > 60) {
      newErrors.name = 'Store name must be at most 60 characters';
    }

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    if (!formData.address) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 400) {
      newErrors.address = 'Address must be at most 400 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await adminService.createStore(formData);
      onSuccess();
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Failed to create store' });
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
        label="Store Name"
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        error={errors.name}
        placeholder="Enter store name (max 60 characters)"
        helperText={`${formData.name.length}/60 characters`}
      />

      <Input
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={errors.email}
        placeholder="Enter store email address"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter store address (max 400 characters)"
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

      <div className="flex space-x-3 pt-4">
        <Button
          type="submit"
          className="flex-1"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create Store
        </Button>
      </div>
    </form>
  );
};
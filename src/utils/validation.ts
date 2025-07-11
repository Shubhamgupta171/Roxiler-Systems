export const validateName = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (name.length < 20) return 'Name must be at least 20 characters long';
  if (name.length > 60) return 'Name must be at most 60 characters long';
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (!address) return 'Address is required';
  if (address.length > 400) return 'Address must be at most 400 characters long';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  if (password.length > 16) return 'Password must be at most 16 characters long';
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
  if (!hasSpecialChar) return 'Password must contain at least one special character';
  
  return null;
};

export const validateRating = (rating: number): string | null => {
  if (rating < 1 || rating > 5) return 'Rating must be between 1 and 5';
  return null;
};
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  // Accepts formats like: +1234567890, +12345678901, +441234567890
  const phoneRegex = /^\+[1-9]\d{9,14}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password: string): boolean => {
  // At least 6 characters, at least one letter and one number, allows special characters
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[\w\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,}$/;
  return passwordRegex.test(password);
};

export const validateSignupForm = (formData: any, isStudent: boolean, institutionType: string) => {
  const errors: Record<string, string> = {};

  // Validate required fields
  if (!formData.firstName) {
    errors.firstName = 'First name is required';
  }

  if (!formData.lastName) {
    errors.lastName = 'Last name is required';
  }

  // Validate email
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone number
  if (!formData.phoneNumber) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!isValidPhoneNumber(formData.phoneNumber)) {
    errors.phoneNumber = 'Please enter a valid phone number (e.g., +1234567890)';
  }

  // Validate password
  if (!formData.password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters and contain both letters and numbers';
  }

  // Validate confirm password
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Validate student-specific fields
  if (isStudent) {
    if (!formData.institutionId) {
      errors.institutionId = 'Institution type is required';
    }
    if (!formData.grade && isStudent) {
      errors.grade = 'Grade is required for a student';
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

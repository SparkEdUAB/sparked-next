import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhoneNumber, isValidPassword, validateSignupForm } from './validation';

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co')).toBe(true);
  });

  it('rejects email missing @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects email missing domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rejects email with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});

describe('isValidPhoneNumber', () => {
  it('accepts valid international numbers', () => {
    expect(isValidPhoneNumber('+1234567890')).toBe(true);
    expect(isValidPhoneNumber('+441234567890')).toBe(true);
  });

  it('rejects number without + prefix', () => {
    expect(isValidPhoneNumber('1234567890')).toBe(false);
  });

  it('rejects too short number', () => {
    expect(isValidPhoneNumber('+12345')).toBe(false);
  });

  it('rejects number with leading 0 after +', () => {
    expect(isValidPhoneNumber('+0123456789')).toBe(false);
  });

  it('rejects number with letters', () => {
    expect(isValidPhoneNumber('+12345abcde')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('accepts password with letters and numbers', () => {
    expect(isValidPassword('abc123')).toBe(true);
  });

  it('accepts password with special chars', () => {
    expect(isValidPassword('abc123!@#')).toBe(true);
  });

  it('rejects password with no number', () => {
    expect(isValidPassword('abcdef')).toBe(false);
  });

  it('rejects password with no letter', () => {
    expect(isValidPassword('123456')).toBe(false);
  });

  it('rejects password too short', () => {
    expect(isValidPassword('ab1')).toBe(false);
  });
});

describe('validateSignupForm', () => {
  const validForm = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    password: 'abc123',
    confirmPassword: 'abc123',
  };

  it('returns valid for complete valid form', () => {
    const result = validateSignupForm(validForm, false, '');
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('returns errors for missing fields', () => {
    const result = validateSignupForm({}, false, '');
    expect(result.isValid).toBe(false);
    expect(result.errors.firstName).toBeDefined();
    expect(result.errors.lastName).toBeDefined();
    expect(result.errors.email).toBeDefined();
    expect(result.errors.phoneNumber).toBeDefined();
    expect(result.errors.password).toBeDefined();
    expect(result.errors.confirmPassword).toBeDefined();
  });

  it('returns error for invalid email', () => {
    const result = validateSignupForm({ ...validForm, email: 'bad-email' }, false, '');
    expect(result.errors.email).toBeDefined();
  });

  it('returns error for invalid phone', () => {
    const result = validateSignupForm({ ...validForm, phoneNumber: '123' }, false, '');
    expect(result.errors.phoneNumber).toBeDefined();
  });

  it('returns error for invalid password', () => {
    const result = validateSignupForm({ ...validForm, password: 'abc', confirmPassword: 'abc' }, false, '');
    expect(result.errors.password).toBeDefined();
  });

  it('returns error for password mismatch', () => {
    const result = validateSignupForm({ ...validForm, confirmPassword: 'different1' }, false, '');
    expect(result.errors.confirmPassword).toBe('Passwords do not match');
  });

  it('requires institution for students', () => {
    const result = validateSignupForm(validForm, true, 'school', null);
    expect(result.errors.institution).toBeDefined();
  });

  it('accepts student with institution selected', () => {
    const result = validateSignupForm(validForm, true, 'school', 'inst-123');
    expect(result.isValid).toBe(true);
  });

  it('returns multiple errors at once', () => {
    const result = validateSignupForm({ email: 'bad', phoneNumber: '123' }, false, '');
    expect(Object.keys(result.errors).length).toBeGreaterThan(2);
  });
});

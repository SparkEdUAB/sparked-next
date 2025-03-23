import React, { FormEventHandler, useState, useEffect } from 'react';
import useAuth from '@hooks/useAuth';
import Link from 'next/link';
import { SIGNUP_FORM_FIELDS } from './constants';
import AppLogo from '@components/logo';
import { T_SignupFields } from '@hooks/useAuth/types';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { AiOutlineLock } from 'react-icons/ai';
import { LuCircleUser } from 'react-icons/lu';
import { Select } from 'flowbite-react';
import { validateSignupForm } from 'utils/helpers/validation';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';


const Signup = () => {
  const { handleSignup, loading } = useAuth();
  const [isStudent, setIsStudent] = useState(false);
  const [institutionType, setInstitutionType] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form data state to track input values
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    grade: ''
  });

  // Errors state
  const [errors, setErrors] = useState<{
    email?: string;
    phoneNumber?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    confirmPassword?: string;
    institutionType?: string;
    schoolName?: string;
    grade?: string;
  }>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form fields as user types
  useEffect(() => {
    // Create a temporary object with current form values
    const dataToValidate = {
      ...formData,
      institutionType
    };

    // Run validation
    const validation = validateSignupForm(dataToValidate, isStudent, institutionType);

    // Update errors - only clear errors for fields that are now valid
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };

      // Check each field that has a value
      Object.keys(dataToValidate).forEach(key => {
        const fieldKey = key as keyof typeof dataToValidate;
        const value = dataToValidate[fieldKey];

        // If field has a value and was previously errored
        if (value !== '' && value !== undefined && prevErrors[fieldKey]) {
          // Check if the field is now valid (not in validation.errors)
          if (!validation.errors[fieldKey]) {
            // Clear the error for this field
            delete newErrors[fieldKey];
          } else {
            // Update the error message
            newErrors[fieldKey] = validation.errors[fieldKey];
          }
        }
        // If field has a value and is invalid but wasn't previously errored
        else if (value !== '' && value !== undefined && validation.errors[fieldKey]) {
          newErrors[fieldKey] = validation.errors[fieldKey];
        }
      });

      return newErrors;
    });
  }, [formData, isStudent, institutionType]);

  // Update the student radio button handling
  const handleStudentChange = (isStudentValue: boolean) => {
    setIsStudent(isStudentValue);

    // Reset institution type when changing student status
    if (!isStudentValue) {
      setInstitutionType('');
      // Also reset school-related fields
      setFormData(prev => ({
        ...prev,
        schoolName: '',
        grade: ''
      }));
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Create a complete result object that includes all form data
    let result: T_SignupFields = {
      ...formData,
      isStudent,
    } as T_SignupFields;

    // Add student-related fields
    if (isStudent) {
      // @ts-expect-error
      result.institutionType = institutionType;
    }

    // Validate the form for submission (show all errors)
    const validation = validateSignupForm(result, isStudent, institutionType);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    handleSignup(result);
  };

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center overflow-auto py-12">
      <div className="flex flex-col items-center justify-center px-6 w-full max-w-2xl mx-auto">
        <Link href="/" className="flex items-center mb-6 transform hover:scale-105 transition-transform">
          <AppLogo />
        </Link>
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
              Join Our Community
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
              Create an account and start your learning journey
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-1.5 block">
                    <Label htmlFor={SIGNUP_FORM_FIELDS.firstName.key} value="First Name *" className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <TextInput
                    icon={LuCircleUser}
                    disabled={loading}
                    id={SIGNUP_FORM_FIELDS.firstName.key}
                    name={SIGNUP_FORM_FIELDS.firstName.key}
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    color={errors.firstName ? "failure" : undefined}
                    helperText={errors.firstName}
                    className="rounded-lg"
                  />
                </div>

                <div>
                  <div className="mb-1.5 block">
                    <Label htmlFor={SIGNUP_FORM_FIELDS.lastName.key} value="Last Name *" className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <TextInput
                    icon={LuCircleUser}
                    disabled={loading}
                    id={SIGNUP_FORM_FIELDS.lastName.key}
                    name={SIGNUP_FORM_FIELDS.lastName.key}
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    color={errors.lastName ? "failure" : undefined}
                    helperText={errors.lastName}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 block">
                  <Label htmlFor={SIGNUP_FORM_FIELDS.email.key} value="Your email *" className="text-gray-700 dark:text-gray-300" />
                </div>
                <TextInput
                  icon={LuCircleUser}
                  disabled={loading}
                  id={SIGNUP_FORM_FIELDS.email.key}
                  name={SIGNUP_FORM_FIELDS.email.key}
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  color={errors.email ? "failure" : undefined}
                  helperText={errors.email}
                  className="rounded-lg"
                />
              </div>

              <div>
                <div className="mb-1.5 block">
                  <Label htmlFor="phoneNumber" value="Phone Number *" className="text-gray-700 dark:text-gray-300" />
                </div>
                <TextInput
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  disabled={loading}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  color={errors.phoneNumber ? "failure" : undefined}
                  helperText={errors.phoneNumber}
                  className="rounded-lg"
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="mb-2 block">
                  <Label value="Are you a student? *" className="text-gray-700 dark:text-gray-300" />
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="isStudent"
                      value="yes"
                      onChange={() => handleStudentChange(true)}
                      checked={isStudent}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <Label className="text-gray-700 dark:text-gray-300">Yes</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="isStudent"
                      value="no"
                      onChange={() => handleStudentChange(false)}
                      checked={!isStudent}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <Label className="text-gray-700 dark:text-gray-300">No</Label>
                  </div>
                </div>
              </div>

              {isStudent && (
                <div className="animate-fadeIn space-y-4 bg-blue-50 dark:bg-gray-700/50 p-4 rounded-lg   dark:border-blue-400">
                  <div>
                    <div className="mb-1.5 block">
                      <Label htmlFor="institutionType" value="Institution Type *" className="text-gray-700 dark:text-gray-300" />
                    </div>
                    <Select
                      id="institutionType"
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      color={errors.institutionType ? "failure" : undefined}
                      helperText={errors.institutionType}
                      className="rounded-lg"
                    >
                      <option value="">Select Institution Type</option>
                      <option value="general">General School</option>
                      <option value="college">College</option>
                      <option value="university">University</option>
                    </Select>
                  </div>

                  {institutionType === 'general' && (
                    <div className="animate-fadeIn space-y-4">
                      <div>
                        <div className="mb-1.5 block">
                          <Label htmlFor="schoolName" value="School Name *" className="text-gray-700 dark:text-gray-300" />
                        </div>
                        <TextInput
                          id="schoolName"
                          name="schoolName"
                          type="text"
                          value={formData.schoolName}
                          onChange={handleInputChange}
                          color={errors.schoolName ? "failure" : undefined}
                          helperText={errors.schoolName}
                          disabled={loading}
                          className="rounded-lg"
                        />
                      </div>

                      <div>
                        <div className="mb-1.5 block">
                          <Label htmlFor="grade" value="Grade *" className="text-gray-700 dark:text-gray-300" />
                        </div>
                        <Select
                          id="grade"
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          color={errors.grade ? "failure" : undefined}
                          helperText={errors.grade}
                          className="rounded-lg"
                        >
                          <option value="">Select Grade</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Grade {i + 1}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-1.5 block">
                    <Label htmlFor="password" value="Password *" className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <TextInput
                    icon={AiOutlineLock}
                    disabled={loading}
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    helperText={errors.password}
                    color={errors.password ? "failure" : undefined}
                    className="rounded-lg"
                    rightIcon={() => (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 pointer-events-auto"
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible className="h-5 w-5" />
                        ) : (
                          <AiOutlineEye className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  />
                </div>

                <div>
                  <div className="mb-1.5 block">
                    <Label htmlFor="confirmPassword" value="Confirm Password *" className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <TextInput
                    icon={AiOutlineLock}
                    disabled={loading}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    color={errors.confirmPassword ? "failure" : undefined}
                    helperText={errors.confirmPassword}
                    className="rounded-lg"
                    rightIcon={() => (
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 pointer-events-auto"
                      >
                        {showConfirmPassword ? (
                          <AiOutlineEyeInvisible className="h-5 w-5" />
                        ) : (
                          <AiOutlineEye className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="xs"
                className="w-full mt-4  hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 py-2.5 rounded-lg"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-3" />
                    {i18next.t('loading')}
                  </>
                ) : (
                  i18next.t('signup')
                )}
              </Button>

              <p className="text-md font-light text-center text-gray-600 dark:text-gray-400 mt-4">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium  hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;

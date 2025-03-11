import React, { FormEventHandler, useState, useEffect } from 'react';
import useAuth from '@hooks/useAuth';
import Link from 'next/link';
import { SIGNUP_FORM_FIELDS } from './constants';
import AppLogo from '@components/logo';
import { T_SignupFields } from '@hooks/useAuth/types';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { AiOutlineLock } from 'react-icons/ai';
import { LuCircleUser } from 'react-icons/lu';
import { Select } from 'flowbite-react';
import { validateSignupForm } from 'utils/helpers/validation';


const Signup = () => {
  const { handleSignup, loading } = useAuth();
  const [isStudent, setIsStudent] = useState(false);
  const [institutionType, setInstitutionType] = useState<string>('');

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
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center overflow-auto py-8">
      <div className="flex flex-col items-center justify-center px-6 w-full max-w-lg mx-auto">
        <Link href="/" className="flex items-center mb-4">
          <AppLogo />
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-3 md:space-y-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create your account
            </h1>
            <form className="space-y-3 md:space-y-4" onSubmit={handleSubmit}>
              {/* First name field */}
              <div>
                <div className="mb-1 block">
                  <Label htmlFor={SIGNUP_FORM_FIELDS.firstName.key} value="First Name *" />
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
                />
              </div>

              {/* Last name field */}
              <div>
                <div className="mb-1 block">
                  <Label htmlFor={SIGNUP_FORM_FIELDS.lastName.key} value="Last Name *" />
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
                />
              </div>

              {/* Email field */}
              <div>
                <div className="mb-1 block">
                  <Label htmlFor={SIGNUP_FORM_FIELDS.email.key} value="Your email *" />
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
                />
              </div>

              {/* Phone number field */}
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="phoneNumber" value="Phone Number *" />
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
                />
              </div>

              {/* Student status field */}
              <div>
                <div className="mb-1 block">
                  <Label value="Are you a student? *" />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="isStudent"
                      value="yes"
                      onChange={() => handleStudentChange(true)}
                      checked={isStudent}
                      className="mr-2"
                    />
                    <Label>Yes</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="isStudent"
                      value="no"
                      onChange={() => handleStudentChange(false)}
                      checked={!isStudent}
                      className="mr-2"
                    />
                    <Label>No</Label>
                  </div>
                </div>
              </div>

              {/* Institution type - update onChange */}
              {isStudent && (
                <>
                  <div>
                    <div className="mb-1 block">
                      <Label htmlFor="institutionType" value="Institution Type *" />
                    </div>
                    <Select
                      id="institutionType"
                      value={institutionType}
                      onChange={(e) => setInstitutionType(e.target.value)}
                      color={errors.institutionType ? "failure" : undefined}
                      helperText={errors.institutionType}
                    >
                      <option value="">Select Institution Type</option>
                      <option value="general">General School</option>
                      <option value="college">College</option>
                      <option value="university">University</option>
                    </Select>
                  </div>

                  {institutionType === 'general' && (
                    <>
                      <div>
                        <div className="mb-1 block">
                          <Label htmlFor="schoolName" value="School Name *" />
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
                        />
                      </div>

                      <div>
                        <div className="mb-1 block">
                          <Label htmlFor="grade" value="Grade *" />
                        </div>
                        <Select
                          id="grade"
                          name="grade"
                          value={formData.grade}
                          onChange={handleInputChange}
                          color={errors.grade ? "failure" : undefined}
                          helperText={errors.grade}
                        >
                          <option value="">Select Grade</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Grade {i + 1}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Password fields */}
              <div>
                <div className="mb-1 block">
                  <Label htmlFor="password" value="Password *" />
                </div>
                <TextInput
                  icon={AiOutlineLock}
                  disabled={loading}
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  helperText={errors.password}
                  color={errors.password ? "failure" : undefined}
                />
              </div>

              <div>
                <div className="mb-1 block">
                  <Label htmlFor="confirmPassword" value="Confirm Password *" />
                </div>
                <TextInput
                  icon={AiOutlineLock}
                  disabled={loading}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  color={errors.confirmPassword ? "failure" : undefined}
                  helperText={errors.confirmPassword}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2"
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

              <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-2">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
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

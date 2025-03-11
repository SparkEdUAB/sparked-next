// Base user interface with common fields
export interface I_BaseUser {
  email: string;
  role?: string;
}

// Personal information interface
export interface I_PersonalInfo {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

// Student-specific information
export interface I_StudentInfo {
  isStudent: boolean;
  institutionType?: 'general' | 'college' | 'university';
  schoolName?: string;
  grade?: number;
}

// Related entities information
export interface I_RelatedEntities {
  schoolId?: string;
  programId?: string;
  schoolName?: string;
  programName?: string;
  courseName?: string;
}

// Pagination parameters
export interface I_FetchUsers {
  limit?: number;
  skip?: number;
}

// User creation fields
export interface I_CreateUserFields extends I_BaseUser {
  first_name: string;
  last_name: string;
  password: string;
  gender: string;
}

// Raw user data as received from API
export interface I_RawUserFields extends I_BaseUser, I_PersonalInfo, I_StudentInfo {
  _id: string;
  is_verified: boolean;
  created_at: string;
}

// Signup fields
export interface I_SignupFields extends I_BaseUser, I_PersonalInfo, I_StudentInfo {
  password: string;
  confirmPassword: string;
}

// Complete user fields with all possible properties
export interface I_UserFields extends I_BaseUser, I_PersonalInfo, I_StudentInfo, I_RelatedEntities {
  index: number;
  key: string;
  name: string;
  _id?: string;
  
  created_by?: string;
  created_at: string;
  
  user?: {
    name: string;
    email: string;
  };
  school?: {
    name: string;
    _id: string;
  };
  program?: {
    name: string;
    _id: string;
  };
  course?: {
    name: string;
    _id: string;
  };
}

// Maintain backward compatibility with existing code
export type T_CreateUserFields = I_CreateUserFields;
export type T_FetchUsers = I_FetchUsers;
export type T_UserFields = I_UserFields;
export type T_RawUserFields = I_RawUserFields;
export type T_SignupFields = I_SignupFields;

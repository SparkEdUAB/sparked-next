export type T_UserFields = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  username: string;
  isStudent: boolean;
  institutionType?: 'general' | 'college' | 'university';
  schoolName?: string;
  grade?: number;
  created_at: string;
};
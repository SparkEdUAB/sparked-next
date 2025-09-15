export interface I_BaseInstitution {
  _id?: string;
  name: string;
  description?: string;
  type: 'school' | 'college' | 'university' | 'organization';
}

export interface I_InstitutionDetails extends I_BaseInstitution {
  logo?: string;
  website?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface I_CreateInstitutionFields extends I_InstitutionDetails {
  is_verified?: boolean;
}

export interface I_RawInstitutionFields extends I_InstitutionDetails {
  _id: string;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface I_InstitutionFields extends I_InstitutionDetails {
  index: number;
  key: string;
  _id: string;
  is_verified: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface I_FetchInstitutions {
  limit?: number;
  skip?: number;
}

export interface I_PublicInstitution {
  _id: string;
  name: string;
  description?: string;
  type: string;
  logo?: string;
}

// Type aliases for easier use
export type T_CreateInstitutionFields = I_CreateInstitutionFields;
export type T_InstitutionFields = I_InstitutionFields;
export type T_RawInstitutionFields = I_RawInstitutionFields;
export type T_FetchInstitutions = I_FetchInstitutions;
export type T_PublicInstitution = I_PublicInstitution;
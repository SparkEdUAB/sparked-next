import { NextRequest } from 'next/server';
import { findInstitutionsByName_ } from '..';

export async function POST(request: NextRequest) {
  return await findInstitutionsByName_(request);
}
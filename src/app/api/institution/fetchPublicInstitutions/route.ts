import { NextRequest } from 'next/server';
import { fetchPublicInstitutions_ } from '..';

export async function POST(request: NextRequest) {
  return await fetchPublicInstitutions_(request);
}
import { NextRequest } from 'next/server';
import fetchInstitutionUsers_ from './index';

export async function POST(request: NextRequest) {
  return await fetchInstitutionUsers_(request);
}

export async function GET(request: NextRequest) {
  return await fetchInstitutionUsers_(request);
}

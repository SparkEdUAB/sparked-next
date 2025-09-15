import { NextRequest } from 'next/server';
import { fetchInstitution_ } from '..';

export async function POST(request: NextRequest) {
  return await fetchInstitution_(request);
}
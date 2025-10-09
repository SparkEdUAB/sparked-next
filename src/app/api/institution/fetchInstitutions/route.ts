import { NextRequest } from 'next/server';
import fetchInstitutions_ from '..';

export async function POST(request: NextRequest) {
  return await fetchInstitutions_(request);
}

export async function GET(request: NextRequest) {
  return await fetchInstitutions_(request);
}
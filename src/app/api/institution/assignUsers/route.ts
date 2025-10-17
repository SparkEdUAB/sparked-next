import { NextRequest } from 'next/server';
import assignUsersToInstitution_ from './index';

export async function POST(request: NextRequest) {
  return await assignUsersToInstitution_(request);
}

export async function PUT(request: NextRequest) {
  return await assignUsersToInstitution_(request);
}

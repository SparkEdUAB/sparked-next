import { NextRequest } from 'next/server';
import { deleteInstitutions_ } from '..';

export async function DELETE(request: NextRequest) {
  return await deleteInstitutions_(request);
}
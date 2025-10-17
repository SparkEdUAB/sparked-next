import { NextRequest, NextResponse } from 'next/server';
import { applyInstitutionFilter } from '../../media-content/middleware';

export async function GET(request: NextRequest) {
  try {
    const testQuery = {};
    const filteredQuery = await applyInstitutionFilter(testQuery);
    
    return NextResponse.json({
      isError: false,
      originalQuery: testQuery,
      filteredQuery: filteredQuery,
      message: 'Institution filter test completed'
    });

  } catch (error) {
    console.error('Filter test error:', error);
    return NextResponse.json({
      isError: true,
      message: 'Error testing filter',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
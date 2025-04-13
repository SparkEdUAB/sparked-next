import { listAllFiles, updateContentType } from '@app/api/file-upload/s3';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const files = await listAllFiles();
    let updatedCount = 0;
    let errors = 0;

    for (const key of files) {
      if (!key) continue;
      try {
        await updateContentType(key);
        updatedCount++;
      } catch (error) {
        console.error(`Failed to update ${key}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      errors: errors,
      message: `Updated ${updatedCount} files with ${errors} errors`,
    });
  } catch (error) {
    console.error('Content type update failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to update content types' }, { status: 500 });
  }
}

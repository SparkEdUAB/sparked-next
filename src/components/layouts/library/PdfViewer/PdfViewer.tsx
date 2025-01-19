'use client';

export default function PdfViewer({ file, className }: { file: string; className?: string }) {
  return (
    <div className={`relative w-full h-[85vh] ${className || ''}`}>
      <object
        data={file}
        type="application/pdf"
        className="w-full h-full"
        style={{
          border: 'none',
          background: 'white',
        }}
      >
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-gray-500">
            Unable to display PDF. Please{' '}
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              download
            </a>{' '}
            instead.
          </p>
        </div>
      </object>
    </div>
  );
}

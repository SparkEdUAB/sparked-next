'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { T_RawMediaContentFields } from 'types/media-content';
import { determineFileType } from 'utils/helpers/determineFileType';
import { getFileUrl } from 'utils/helpers/getFileUrl';
import { LibraryErrorMessage } from './LibraryErrorMessage/LibraryErrorMessage';
import { useScreenDetector } from '@hooks/useScreenDetactor';

const VideoViewer = dynamic(() => import('next-video/player'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-[400px] w-full rounded-lg"></div>,
});

const PdfViewer = dynamic(() => import('@components/layouts/library/PdfViewer/PdfViewer'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-[400px] w-full rounded-lg"></div>,
});

export function MediaViewer({ mediaContent }: { mediaContent: T_RawMediaContentFields }) {
  const { isDeviceMobile } = useScreenDetector();
  const fileType = useMemo(() => determineFileType(mediaContent?.file_url || ''), [mediaContent?.file_url]);
  const fileUrl = useMemo(
    () => (mediaContent.file_url ? getFileUrl(mediaContent.file_url) : ''),
    [mediaContent.file_url],
  );
  const externalUrl = mediaContent.external_url;

  return useMemo(() => {
    if (!fileUrl && !externalUrl) {
      return (
        <LibraryErrorMessage className="h-fit min-h-0">
          This file cannot be rendered. Please contact the site administrator with the details.
        </LibraryErrorMessage>
      );
    }

    if (externalUrl) {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;

      if (youtubeRegex.test(externalUrl)) {
        const videoId = externalUrl.match(
          /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
        )?.[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        return (
          <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ width: '100%', height: '100%' }}
              title="YouTube Video"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      if (vimeoRegex.test(externalUrl)) {
        const videoId = externalUrl.match(/vimeo\.com\/(\d+)/)?.[1];
        const embedUrl = `https://player.vimeo.com/video/${videoId}`;
        return (
          <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{ width: '100%', height: '100%' }}
              title="Vimeo Video"
              allowFullScreen
            ></iframe>
          </div>
        );
      }

      return (
        <div className="w-full h-[80vh] rounded-lg overflow-hidden">
          <iframe
            src={externalUrl}
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin"
            style={{ width: '100%', height: '80vh' }}
            title="External Content"
          ></iframe>
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <Image
            src={fileUrl}
            alt={mediaContent.name}
            className="max-h-[500px] max-w-full object-contain object-left"
            width={800}
            height={600}
            priority
            loading="eager"
          />
        );
      case 'video':
        return <VideoViewer src={fileUrl} />;
      case 'pdf':
        return (
          <div className="w-full h-[80vh] rounded-lg overflow-hidden relative">
            {isDeviceMobile ? (
              <PdfViewer file={fileUrl} />
            ) : (
              <iframe
                src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                className="w-full h-full border-0"
                title={`PDF: ${mediaContent.name}`}
                loading="lazy"
              />
            )}
          </div>
        );
      default:
        return <LibraryErrorMessage>Could not recognize the file type</LibraryErrorMessage>;
    }
  }, [fileUrl, fileType, mediaContent.name, externalUrl, isDeviceMobile]);
}

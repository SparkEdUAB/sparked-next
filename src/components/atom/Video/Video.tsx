'use client';

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

interface VideoJSProps {
  options: {
    autoplay?: boolean;
    controls?: boolean;
    responsive?: boolean;
    fluid?: boolean;
    sources: {
      src: string;
      type: string;
    }[];
  };
  onReady?: (player: Player) => void;
}

export const VideoJS: React.FC<VideoJSProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady?.(player);
      });

      playerRef.current = player;

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else if (playerRef.current) {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [onReady, options]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
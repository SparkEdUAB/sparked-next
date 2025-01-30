import { useState } from 'react';
import useSWR from 'swr';
import { Session } from 'next-auth';
import { useFetch } from './use-swr';

export function useMediaInteractions(mediaId: string, initialViewCount: number = 0) {
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: viewCountData } = useFetch(`/api/media-actions/getViewCount?mediaId=${mediaId}`);

  const {
    data: reactionData,
    isLoading: isLoadingReactions,
    mutate: mutateReactions,
  } = useFetch(`/api/media-actions/getMediaReactionCounts?mediaId=${mediaId}`);

  const recordView = async () => {
    if (hasRecordedView) return;

    setIsLoading(true);
    try {
      await fetch('/api/media-actions/createMediaView', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaId,
          timestamp: Date.now(),
        }),
      });

      setHasRecordedView(true);
    } catch (error) {
      console.error('Error recording view:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (type: 'like' | 'dislike', session: Session | null) => {
    if (!session) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/media-actions/createMediaReaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: type,
          mediaId,
          userEmail: session.user?.email,
        }),
      });
      if (!response.ok) throw new Error('Failed to process reaction');
    } catch (error) {
      console.error('Error processing reaction:', error);
    } finally {
      mutateReactions();
      setIsLoading(false);
    }
  };

  return {
    viewCount: viewCountData?.viewCount,
    reactionData,
    isLoadingReactions: isLoadingReactions || isLoading,
    recordView,
    handleReaction,
    hasRecordedView,
  };
}

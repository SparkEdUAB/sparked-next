import { useEffect } from 'react';

export function useDocumentTitle(title: string) {
  useEffect(() => {
    if (typeof title === 'string' && title.trim().length > 0) {
      document.title = title.trim();
    }
  }, [title]);
}

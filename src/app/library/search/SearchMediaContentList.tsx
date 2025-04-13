'use client';

import { LibraryInfiniteScrollList } from '@components/library/LibraryInfiniteScrollList';
import { useFetch } from '@hooks/use-swr';
import { useSearchMediaSWR } from '@hooks/useLibrary/useSearchMediaSWR';
import { API_LINKS } from 'app/links';
import { Dropdown } from 'flowbite-react';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import NETWORK_UTILS from 'utils/network';
import { SearchSkeleton } from './SearchSkeleton';

import Link from 'next/link';
import { HiOutlineArrowLeft, HiOutlineSearch } from 'react-icons/hi';

const GradePicker = ({
  grades,
  gradeId,
  setGradeId,
}: {
  grades: any[];
  gradeId: string;
  setGradeId: (id: string) => void;
}) => (
  <Dropdown
    label={
      gradeId
        ? (grades instanceof Array && grades.find((g) => g._id === gradeId)?.name) || i18next.t('Select Grade')
        : i18next.t('Select Grade')
    }
    dismissOnClick={true}
  >
    {gradeId && <Dropdown.Item onClick={() => setGradeId('')}>{i18next.t('All Grades')}</Dropdown.Item>}
    {grades instanceof Array &&
      grades.map((grade) => (
        <Dropdown.Item
          key={grade._id}
          onClick={() => {
            setGradeId(grade._id);
          }}
        >
          {grade.name}
        </Dropdown.Item>
      ))}
  </Dropdown>
);

export function SearchMediaContentList() {
  const params = useSearchParams();
  const [gradeId, setGradeId] = useState('');
  const searchTerm = params.get('q') || '';
  const sortBy = params.get('sort_by') || '';
  const query = { limit: '50', skip: '0', withMetaData: 'true' };
  const { data } = useFetch(`${API_LINKS.FETCH_GRADES}${NETWORK_UTILS.formatGetParams(query)}`);

  const grades = data?.grades;

  const { mediaContent, error, hasMore, loadMore, isLoadingInitialData, isValidating } = useSearchMediaSWR(
    searchTerm,
    sortBy,
    gradeId,
  );

  if (isLoadingInitialData || isValidating) {
    return <SearchSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-6 p-4 text-center">
        <div className="flex justify-end mx-3 mb-4">
          <GradePicker grades={grades || []} gradeId={gradeId} setGradeId={setGradeId} />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block mx-auto">
          <h3 className="text-red-700 text-lg font-medium mb-2">Error loading results</h3>
          <p className="text-red-600">There was a problem loading search results. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!isLoadingInitialData && (!mediaContent || mediaContent.length === 0)) {
    return (
      <div>
        <div className="flex justify-end mx-3 mt-6 mb-4">
          <GradePicker grades={grades || []} gradeId={gradeId} setGradeId={setGradeId} />
        </div>
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className=" p-6 rounded-full mb-6">
            <HiOutlineSearch className="w-16 h-16 text-gray-400" />
          </div>

          <h2 className="text-2xl font-bold mb-2">No results found</h2>

          <p className="text-gray-400 mb-6 max-w-md text-center">
            We couldn&lsquo;t find any content matching &quot;<span className="font-semibold">{searchTerm}</span>&quot;
            {gradeId && grades instanceof Array && ' for grade ' + grades.find((g) => g._id === gradeId)?.name}. Try
            selecting a different grade or modifying your search terms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link
              href="/library"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              Back to Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 search-results">
      <div className="flex justify-between items-center mx-3 mb-6">
        <div className="flex-1 flex justify-center items-center gap-2">
          <p className="text-center">
            <span className="font-medium">{mediaContent?.length || 0}</span> results found for{' '}
            <span className="font-medium">&quot;{searchTerm}&quot;</span>
          </p>
        </div>

        <div className="flex gap-3">
          <GradePicker grades={grades || []} gradeId={gradeId} setGradeId={setGradeId} />
        </div>
      </div>

      <div className="px-3">
        <LibraryInfiniteScrollList
          mediaContent={mediaContent}
          loadMore={loadMore}
          hasMore={hasMore as boolean}
          error={error}
        />
      </div>
    </div>
  );
}

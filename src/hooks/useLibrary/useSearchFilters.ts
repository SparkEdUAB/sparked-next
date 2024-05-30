import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export type T_Filters = {
  school_id?: string;
  category_id?: string;
  program_id?: string;
  course_id?: string;
  unit_id?: string;
  topic_id?: string;
};

export default function useSearchFilters() {
  let params = useSearchParams();

  return useMemo(() => {
    let filters: T_Filters = {};

    if (params.get('school_id')) filters.school_id = params.get('school_id') as string;
    if (params.get('program_id')) filters.program_id = params.get('program_id') as string;
    if (params.get('course_id')) filters.course_id = params.get('course_id') as string;
    if (params.get('unit_id')) filters.unit_id = params.get('unit_id') as string;
    if (params.get('topic_id')) filters.topic_id = params.get('topic_id') as string;

    return filters;
  }, [params]);
}

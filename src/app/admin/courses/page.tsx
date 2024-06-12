'use client';

import CourseListView from '@components/courses/courseListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const AdminSchools = ({ params: { lng } }: { params: { lng: string } }) => {
  useDocumentTitle('Courses');

  return <CourseListView />;
};

export default AdminSchools;

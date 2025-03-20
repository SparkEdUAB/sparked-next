'use client';

import CourseListView from '@components/courses/courseListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const AdminSchools = () => {
  useDocumentTitle('Courses');

  return <CourseListView />;
};

export default AdminSchools;

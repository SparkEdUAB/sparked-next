'use client';

import CourseListView from '@components/courses/courseListView';
import React from 'react';

const AdminSchools = ({ params: { lng } }: { params: { lng: string } }) => {
  return <CourseListView />;
};

export default AdminSchools;

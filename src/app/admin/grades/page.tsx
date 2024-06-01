'use client';

import GradeListView from '@components/grades/gradeListView';
import React from 'react';

const AdminGrades = ({ params: { lng } }: { params: { lng: string } }) => {
  return <GradeListView />;
};

export default AdminGrades;

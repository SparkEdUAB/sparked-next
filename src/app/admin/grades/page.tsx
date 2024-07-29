'use client';

import GradeListView from '@components/grades/gradeListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const AdminGrades = ({}: { params: { lng: string } }) => {
  useDocumentTitle('Grades');

  return <GradeListView />;
};

export default AdminGrades;

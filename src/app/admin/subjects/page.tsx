'use client';

import SubjectListView from '@components/subjects/subjectListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const AdminSubjects = ({ params: { lng } }: { params: { lng: string } }) => {
  useDocumentTitle('Subjects');

  return <SubjectListView />;
};

export default AdminSubjects;

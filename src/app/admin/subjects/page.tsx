'use client';

import SubjectListView from '@components/subjects/subjectListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const AdminSubjects = () => {
  useDocumentTitle('Subjects');

  return <SubjectListView />;
};

export default AdminSubjects;

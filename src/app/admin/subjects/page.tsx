'use client';

import SubjectListView from '@components/subjects/subjectListView';
import React from 'react';

const AdminSubjects = ({ params: { lng } }: { params: { lng: string } }) => {
  return <SubjectListView />;
};

export default AdminSubjects;

'use client';

import SchoolsListView from '@components/school/schoolsListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const AdminSchools: React.FC = () => {
  useDocumentTitle('Schools');

  return <SchoolsListView />;
};

export default AdminSchools;

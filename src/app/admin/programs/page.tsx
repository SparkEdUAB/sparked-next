'use client';

import ProgramsListView from '@components/programs/programListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const ProgramsList: React.FC = () => {
  useDocumentTitle('Programs');

  return <ProgramsListView />;
};

export default ProgramsList;

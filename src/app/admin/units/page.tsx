'use client';

import UnitListView from '@components/units/unitListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const UnitsList: React.FC = () => {
  useDocumentTitle('Units');

  return <UnitListView />;
};

export default UnitsList;

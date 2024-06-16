'use client';

import UsersListView from '@components/users/UsersListView';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import React from 'react';

const UsersList: React.FC = (props) => {
  useDocumentTitle('Users Management');

  return <UsersListView />;
};

export default UsersList;

'use client';

import ContentPlaceholder from '@components/atom/ContentPlaceholder/ContentPlaceholder';
import Login from '@components/auth/login';
import AdminLayout from '@components/layouts/adminLayout';
import React from 'react';

const Home: React.FC = (props) => {
  return (
    <AdminLayout>
      <ContentPlaceholder message="The admin dashboard will be placed here" />
    </AdminLayout>
  );
};

export default Home;

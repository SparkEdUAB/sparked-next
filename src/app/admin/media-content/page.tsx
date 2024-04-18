'use client';

import AdminLayout from '@components/layouts/adminLayout';
import MediaContentListView from '@components/media-content/media-content-list-view';
import { SWRProvider } from 'app/swr-provider';
import React from 'react';

const AdminSchools: React.FC = (props) => {
  return (
    <SWRProvider>
      <AdminLayout>
        <MediaContentListView />
      </AdminLayout>
    </SWRProvider>
  );
};

export default AdminSchools;

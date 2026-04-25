'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useMediaContent, { transformRawMediaContent } from '@hooks/use-media-content';
import { T_MediaContentFields } from 'types/media-content';
import { mediaContentTableColumns } from '.';
import CreateMediaContentView from './create-media-content-view';
import EditMediaContentView from './edit-media-content-view';
import UploadMultipleResources from './upload-multiple/upload-multiple-resources';
import { LuFiles } from 'react-icons/lu';
import i18next from 'i18next';

const MediaContentListView: React.FC = () => {
  const {
    selectedMediaContentIds,
    setSelectedMediaContentIds,
    onSearchQueryChange,
    deleteMediaContent,
    searchQuery,
  } = useMediaContent();
  const [creatingResource, setCreatingResource] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);
  const [edittingResource, setEdittingResource] = useState<T_MediaContentFields | null>(null);

  const { items: mediaContent, isLoading, mutate, loadMore, hasMore, error } =
    useAdminListViewData(
      API_LINKS.FETCH_MEDIA_CONTENT,
      'mediaContent',
      transformRawMediaContent,
      API_LINKS.FIND_MEDIA_CONTENT_BY_NAME,
      searchQuery,
    );

  const rowSelection = {
    selectedRowKeys: selectedMediaContentIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedMediaContentIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('media_content')}</h1>
      </div>

      <DataTable<T_MediaContentFields>
        deleteItems={async () => { const r = await deleteMediaContent(); mutate(); return r; }}
        rowSelection={rowSelection}
        items={mediaContent}
        isLoading={isLoading}
        createNew={() => setCreatingResource(true)}
        editItem={(item) => setEdittingResource(item)}
        columns={mediaContentTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
        additionalButtons={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setUploadingMultiple(true)}>
            <LuFiles className="h-4 w-4" />
            {i18next.t('upload_multiple')}
          </Button>
        }
      />

      <FormSheet
        open={creatingResource}
        onClose={() => setCreatingResource(false)}
        title="Create Media Content"
      >
        <CreateMediaContentView
          onSuccessfullyDone={() => { mutate(); setCreatingResource(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingResource}
        onClose={() => setEdittingResource(null)}
        title="Edit Media Content"
      >
        {edittingResource && (
          <EditMediaContentView
            mediaContent={edittingResource}
            onSuccessfullyDone={() => { mutate(); setEdittingResource(null); }}
          />
        )}
      </FormSheet>

      {/* Upload multiple — stays as Dialog (large form) */}
      <Dialog open={uploadingMultiple} onOpenChange={(v) => !v && setUploadingMultiple(false)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>{i18next.t('upload_multiple')}</DialogTitle>
          </DialogHeader>
          <UploadMultipleResources
            onSuccessfullyDone={() => { mutate(); setUploadingMultiple(false); }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaContentListView;

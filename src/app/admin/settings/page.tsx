'use client';

import { AdminPageTitle } from '@components/layouts';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import { TextInput } from 'flowbite-react';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { AiOutlineRight } from 'react-icons/ai';
import { SelectDropdown } from '../../../components/atom/SelectDropdown/SelectDropdown';

export default function SettingsPage() {
  useDocumentTitle('Settings');

  let [uploadLocation, setUploadLocation] = useState<'aws' | 'local'>('local');
  let [setup, setSetup] = useState<'High school' | 'Tertiary' | 'Organizations'>('High school');

  return (
    <>
      <AdminPageTitle title="Settings" />

      <div className="flex flex-col max-w-3xl divide-y divide-gray-200 dark:divide-gray-700">
        <div className="py-4">
          <SettingsLink
            href="/admin/settings/roles"
            title="Roles"
            subtitle="Permissions | Page Access | Page Action Control"
          />
        </div>
        <div className="py-4">
          <SettingsLink href="/admin/settings/pages" title="Pages" subtitle="Manage App Pages | Manage Page Actions" />
        </div>
        <div className="py-4">
          <SettingsItem title="Upload locations" subtitle="Choose the destination of uploaded files">
            <SelectDropdown
              selected={uploadLocation}
              setSelected={setUploadLocation}
              options={[
                { label: 'AWS S3', value: 'aws' },
                { label: 'Local Server', value: 'local' },
              ]}
              inline
            />
          </SettingsItem>
          {uploadLocation === 'aws' && (
            <div className="my-4">
              <TextInput className="my-2" name="AWS_ACCESS_KEY" placeholder="AWS Access Key" />
              <TextInput className="my-2" name="AWS_SECRET_ACCESS_KEY" placeholder="AWS Secret Access Key" />
              <TextInput className="my-2" name="S3_BUCKET" placeholder="S3 Bucket" />
              <TextInput className="my-2" name="S3_MEDIA_CONTENT_FOLDER" placeholder="S3 Media Content Folder" />
              <TextInput className="my-2" name="S3_BUCKET_NAME_URL" placeholder="S3 Bucket Name URL" />
            </div>
          )}
        </div>
        <div className="py-4">
          <SettingsItem title="Institution Name" subtitle="Update the name of the institution for this website" />
          <TextInput className="my-4" placeholder="Institution Name" />
        </div>
        <div className="py-4">
          <SettingsItem title="Setup" subtitle="Specify the nature of the organization">
            <SelectDropdown
              selected={setup}
              setSelected={setSetup}
              options={['High school', 'Tertiary', 'Organizations']}
              inline
            />
          </SettingsItem>
        </div>
      </div>
    </>
  );
}

function SettingsItem({
  children,
  subtitle,
  title,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode | ReactNode[];
}) {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <span>{title}</span>
        <span className="opacity-50">{subtitle}</span>
      </div>
      {children}
    </div>
  );
}

function SettingsLink({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return (
    <Link href={href}>
      <SettingsItem title={title} subtitle={subtitle}>
        <AiOutlineRight className="text-gray-600 dark:text-gray-400" size={24} />
      </SettingsItem>
    </Link>
  );
}

/*
    Upload location
        AWS S3
        Local server
    Institution name
    Setup
        High school
        Tertiary
        Organizations
    Synchronization configs
    Auth requirement
        required (only logged in users can access anything)
        public (anyone can access all resources)
    etc ...
*/

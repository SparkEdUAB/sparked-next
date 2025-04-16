'use client';

import { AdminPageTitle } from '@components/layouts';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import { Button, TextInput, Toast } from 'flowbite-react';
import { ReactNode, useEffect, useState } from 'react';
import { AiOutlineCheck, AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { SelectDropdown } from '../../../components/atom/SelectDropdown/SelectDropdown';
import { HiInformationCircle, HiCog, HiOfficeBuilding } from 'react-icons/hi';

type Institution = {
  id?: string;
  name: string;
  type: 'highSchool' | 'college' | 'other';
  address?: string;
  contactInfo?: string;
  isActive?: boolean;
  isConfigured?: boolean;
};

type Settings = {
  key: string;
  uploadSetup: 'local' | 's3';
  scope?: string;
  category?: string;
  institutions: Institution[];
};

export default function SettingsPage() {
  useDocumentTitle('Settings');

  const [activeStep, setActiveStep] = useState(0);
  const [settings, setSettings] = useState<Settings>({
    key: 'global_settings',
    uploadSetup: 's3',
    institutions: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [newInstitution, setNewInstitution] = useState<Institution>({
    name: '',
    type: 'highSchool',
  });

  // Fetch settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings/fetchSettings');
        const data = await response.json();

        console.log(data);
        if (!data.isError && data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        setError('Failed to load settings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdateSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate required fields
      if (!settings.uploadSetup) {
        throw new Error('Upload location is required');
      }

      const response = await fetch('/api/settings/updateSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uploadSetup: settings.uploadSetup,
          scope: settings.scope,
          category: settings.category,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.isError) {
        throw new Error(data.message || 'Failed to update settings');
      } else {
        setSuccess('Settings updated successfully');
        setTimeout(() => setActiveStep(1), 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstitution = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/settings/addInstitution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInstitution),
      });

      const data = await response.json();

      if (data.isError) {
        setError('Failed to add institution');
      } else {
        setSuccess('Institution added successfully');

        // Refresh settings to get updated institutions list
        const settingsResponse = await fetch('/api/settings/fetchSettings');
        const settingsData = await settingsResponse.json();

        if (!settingsData.isError && settingsData.settings) {
          setSettings(settingsData.settings);
        }

        // Reset new institution form
        setNewInstitution({
          name: '',
          type: 'highSchool',
        });
      }
    } catch (err) {
      setError('An error occurred while adding institution');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInstitution = async () => {
    if (!editingInstitution || !editingInstitution.id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/settings/updateInstitution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingInstitution),
      });

      const data = await response.json();

      if (data.isError) {
        setError('Failed to update institution');
      } else {
        setSuccess('Institution updated successfully');

        // Refresh settings to get updated institutions list
        const settingsResponse = await fetch('/api/settings/fetchSettings');
        const settingsData = await settingsResponse.json();

        if (!settingsData.isError && settingsData.settings) {
          setSettings(settingsData.settings);
        }

        // Reset editing state
        setEditingInstitution(null);
      }
    } catch (err) {
      setError('An error occurred while updating institution');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstitution = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/settings/removeInstitution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.isError) {
        setError('Failed to delete institution');
      } else {
        setSuccess('Institution deleted successfully');

        // Refresh settings to get updated institutions list
        const settingsResponse = await fetch('/api/settings/fetchSettings');
        const settingsData = await settingsResponse.json();

        if (!settingsData.isError && settingsData.settings) {
          setSettings(settingsData.settings);
        }
      }
    } catch (err) {
      setError('An error occurred while deleting institution');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'General Settings', description: 'Configure general application settings' },
    { title: 'Institutions', description: 'Manage institutions' },
  ];

  return (
    <>
      <AdminPageTitle title="Settings" />

      {/* Improved Stepper Header */}
      <div className="mb-8 max-w-3xl">
        <ol className="flex items-center w-full">
          <li className={`flex items-center w-full relative ${activeStep >= 0 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              activeStep >= 0 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'
            } z-10`}>
              {activeStep > 0 ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              ) : (
                <span>1</span>
              )}
            </div>
            <div className="flex flex-col ml-3 cursor-pointer" onClick={() => setActiveStep(0)}>
              <span className="text-sm font-medium">General Settings</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Configure application settings</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${activeStep > 0 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          </li>
          
          <li className={`flex items-center w-full relative ${activeStep >= 1 ? 'text-blue-600 dark:text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              activeStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-500'
            } z-10`}>
              <span>2</span>
            </div>
            <div className="flex flex-col ml-3 cursor-pointer" onClick={() => setActiveStep(1)}>
              <span className="text-sm font-medium">Institutions</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Manage institutions</span>
            </div>
          </li>
        </ol>
      </div>

      {/* Toast messages */}
      {error && (
        <Toast className="mb-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiInformationCircle className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{error}</div>
          <Toast.Toggle onDismiss={() => setError(null)} />
        </Toast>
      )}

      {success && (
        <Toast className="mb-4">
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <AiOutlineCheck className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{success}</div>
          <Toast.Toggle onDismiss={() => setSuccess(null)} />
        </Toast>
      )}

      {/* Step content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-3xl">
        {activeStep === 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">General Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Upload Location</label>
                <SelectDropdown
                  selected={settings.uploadSetup}
                  setSelected={(value) => setSettings({ ...settings, uploadSetup: value as 'local' | 's3' })}
                  options={[
                    { label: 'AWS S3', value: 's3' },
                    { label: 'Local Server', value: 'local' },
                  ]}
                />
              </div>

              {settings.uploadSetup === 's3' && (
                <div className="space-y-2">
                  <TextInput name="AWS_ACCESS_KEY" placeholder="AWS Access Key" />
                  <TextInput name="AWS_SECRET_ACCESS_KEY" placeholder="AWS Secret Access Key" type="password" />
                  <TextInput name="S3_BUCKET" placeholder="S3 Bucket" />
                  <TextInput name="S3_MEDIA_CONTENT_FOLDER" placeholder="S3 Media Content Folder" />
                  <TextInput name="S3_BUCKET_NAME_URL" placeholder="S3 Bucket Name URL" />
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <TextInput
                  value={settings.category || ''}
                  onChange={(e) => setSettings({ ...settings, category: e.target.value })}
                  placeholder="Category"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Scope</label>
                <SelectDropdown
                  selected={settings.scope || 'global'}
                  setSelected={(value) => setSettings({ ...settings, scope: value })}
                  options={[
                    { label: 'Global', value: 'global' },
                    { label: 'User', value: 'user' },
                    { label: 'School', value: 'school' },
                  ]}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button color="blue" onClick={handleUpdateSettings} isProcessing={loading}>
                Save & Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Manage Institutions</h2>

            {/* Institutions list */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Institutions</h3>

              {settings.institutions && settings.institutions.length > 0 ? (
                <div className="space-y-2">
                  {settings.institutions.map((institution, index) => (
                    <div
                      key={institution.id || index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{institution.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Type: {institution.type} |{institution.address && ` Address: ${institution.address} |`}
                          {institution.isActive !== undefined &&
                            ` Status: ${institution.isActive ? 'Active' : 'Inactive'}`}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button color="light" size="xs" onClick={() => setEditingInstitution(institution)}>
                          <AiOutlineEdit className="mr-1" /> Edit
                        </Button>
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => institution.id && handleDeleteInstitution(institution.id)}
                        >
                          <AiOutlineDelete className="mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No institutions added yet.</p>
              )}

              {/* Edit institution form */}
              {editingInstitution && (
                <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Edit Institution</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                        Institution Name
                      </label>
                      <TextInput
                        value={editingInstitution.name}
                        onChange={(e) => setEditingInstitution({ ...editingInstitution, name: e.target.value })}
                        placeholder="Institution Name"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                      <SelectDropdown
                        selected={editingInstitution.type}
                        setSelected={(value) =>
                          setEditingInstitution({
                            ...editingInstitution,
                            type: value as 'highSchool' | 'college' | 'other',
                          })
                        }
                        options={[
                          { label: 'High School', value: 'highSchool' },
                          { label: 'College', value: 'college' },
                          { label: 'Other', value: 'other' },
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                      <TextInput
                        value={editingInstitution.address || ''}
                        onChange={(e) => setEditingInstitution({ ...editingInstitution, address: e.target.value })}
                        placeholder="Address"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                        Contact Info
                      </label>
                      <TextInput
                        value={editingInstitution.contactInfo || ''}
                        onChange={(e) => setEditingInstitution({ ...editingInstitution, contactInfo: e.target.value })}
                        placeholder="Contact Information"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingInstitution.isActive !== false}
                          onChange={(e) => setEditingInstitution({ ...editingInstitution, isActive: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Active</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <Button color="light" onClick={() => setEditingInstitution(null)}>
                        Cancel
                      </Button>
                      <Button color="blue" onClick={handleUpdateInstitution} isProcessing={loading}>
                        Update Institution
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add new institution form */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Add New Institution</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                      Institution Name
                    </label>
                    <TextInput
                      value={newInstitution.name}
                      onChange={(e) => setNewInstitution({ ...newInstitution, name: e.target.value })}
                      placeholder="Institution Name"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Type</label>
                    <SelectDropdown
                      selected={newInstitution.type}
                      setSelected={(value) =>
                        setNewInstitution({
                          ...newInstitution,
                          type: value as 'highSchool' | 'college' | 'other',
                        })
                      }
                      options={[
                        { label: 'High School', value: 'highSchool' },
                        { label: 'College', value: 'college' },
                        { label: 'Other', value: 'other' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                    <TextInput
                      value={newInstitution.address || ''}
                      onChange={(e) => setNewInstitution({ ...newInstitution, address: e.target.value })}
                      placeholder="Address"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Contact Info</label>
                    <TextInput
                      value={newInstitution.contactInfo || ''}
                      onChange={(e) => setNewInstitution({ ...newInstitution, contactInfo: e.target.value })}
                      placeholder="Contact Information"
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button color="blue" onClick={handleAddInstitution} isProcessing={loading}>
                      <AiOutlinePlus className="mr-1" /> Add Institution
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button color="light" onClick={() => setActiveStep(0)}>
                Back to General Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

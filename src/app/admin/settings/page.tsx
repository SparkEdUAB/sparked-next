'use client';

import { SelectDropdown } from '@components/atom/SelectDropdown/SelectDropdown';
import { AdminPageTitle } from '@components/layouts';
import { useActionMutation, useFetch } from '@hooks/use-swr';
import { useDocumentTitle } from '@hooks/useDocumentTitle/useDocumentTitle';
import { Button, Label, Radio, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';

type Institution = {
  _id?: string;
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
  const [, setUploadSetup] = useState<'local' | 's3'>('s3');
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newInstitution, setNewInstitution] = useState<Institution>({
    name: '',
    type: 'highSchool',
  });
  const { data, mutate } = useFetch('/api/settings/fetchSettings');

  const settings: Settings = data?.settings || {
    key: 'global_settings',
    uploadSetup: 's3',
    institutions: [],
  };

  const { trigger: addInstitution, isMutating: isAddingInstitution } =
    useActionMutation('/api/settings/addInstitution');
  const { trigger: updateInstitution, isMutating: isUpdatingInstitution } = useActionMutation(
    '/api/settings/updateInstitution',
  );
  const { trigger: deleteInstitution, isMutating: isDeletingInstitution } = useActionMutation(
    '/api/settings/removeInstitution',
  );

  const handleAddInstitution = async () => {
    if (newInstitution.name.trim() === '') {
      return;
    }
    await addInstitution(newInstitution);
    await mutate();
    setNewInstitution({
      name: '',
      type: 'highSchool',
    });
  };

  const handleUpdateInstitution = async () => {
    if (!editingInstitution || !editingInstitution._id) return;

    await updateInstitution({ id: editingInstitution._id, ...editingInstitution });
    await mutate();
    setEditingInstitution(null);
  };

  const handleDeleteInstitution = async (id: string) => {
    await deleteInstitution({ id });
    await mutate();
  };

  return (
    <>
      <AdminPageTitle title="Settings" />

      <div className="mb-8 mt-8 max-w-3xl">
        <ol className="flex items-center w-full">
          <li
            className={`flex items-center w-full relative ${
              activeStep >= 0 ? 'text-teal-600 dark:text-teal-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                activeStep >= 0 ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300 text-gray-500'
              } z-10`}
            >
              {activeStep > 0 ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <span>1</span>
              )}
            </div>
            <div className="flex flex-col ml-3 cursor-pointer" onClick={() => setActiveStep(0)}>
              <span className="text-sm font-medium">General Settings</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                Configure application settings
              </span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${activeStep > 0 ? 'bg-teal-600' : 'bg-gray-300'}`}></div>
          </li>

          <li
            className={`flex items-center w-full relative ${
              activeStep >= 1 ? 'text-teal-600 dark:text-teal-500' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                activeStep >= 1 ? 'bg-teal-600 border-teal-600 text-white' : 'border-gray-300 text-gray-500'
              } z-10`}
            >
              <span>2</span>
            </div>
            <div className="flex flex-col ml-3 cursor-pointer" onClick={() => setActiveStep(1)}>
              <span className="text-sm font-medium">Institutions</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Manage institutions</span>
            </div>
          </li>
        </ol>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-3xl">
        {activeStep === 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Upload Location</h2>

            <div className="space-y-4">
              <div className="flex max-w-md flex-row gap-6">
                <div className="flex items-center gap-2">
                  <Radio id="s3" name="uploadSetup" value="s3" defaultChecked onChange={() => setUploadSetup('s3')} />
                  <Label htmlFor="s3">AWS S3</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Radio id="local" name="uploadSetup" value="local" onChange={() => setUploadSetup('local')} />
                  <Label htmlFor="local">Local server</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-start space-x-2">
              <Button color="teal" onClick={() => setActiveStep(1)} isProcessing={false}>
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Manage Institutions</h2>

            <div className="space-y-4">
              {/* <h3 className="text-lg font-medium">Current Institutions</h3> */}

              {settings.institutions && settings.institutions.length > 0 ? (
                <div className="space-y-2">
                  {settings.institutions.map((institution, index) => (
                    <div
                      key={institution._id || index}
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
                          <AiOutlineEdit className="mr-1 " /> Edit
                        </Button>
                        <Button
                          color="failure"
                          size="xs"
                          isProcessing={isDeletingInstitution}
                          onClick={() => institution._id && handleDeleteInstitution(institution._id)}
                        >
                          <AiOutlineDelete className="mr-1 " /> Delete
                        </Button>
                      </div>
                    </div>
                  ))}

                  {!isEditing && (
                    <div className="flex justify-end mt-4">
                      <Button color="teal" onClick={() => setIsEditing(true)}>
                        <AiOutlinePlus className="mr-1" /> Add Institution
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No institutions added yet.</p>

                  {!isEditing && (
                    <Button color="teal" onClick={() => setIsEditing(true)}>
                      <AiOutlinePlus className="mr-1" /> Add First Institution
                    </Button>
                  )}
                </div>
              )}
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Active</span>
                      </label>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <Button color="light" onClick={() => setEditingInstitution(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateInstitution} isProcessing={isUpdatingInstitution}>
                        Update Institution
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {isEditing ? (
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
                      <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                        Contact Info
                      </label>
                      <TextInput
                        value={newInstitution.contactInfo || ''}
                        onChange={(e) => setNewInstitution({ ...newInstitution, contactInfo: e.target.value })}
                        placeholder="Contact Information"
                      />
                    </div>

                    <div className="flex justify-end mt-4 gap-4">
                      <Button color="teal" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddInstitution} isProcessing={isAddingInstitution}>
                        <AiOutlinePlus className="mr-1 mt-1" /> Add Institution
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

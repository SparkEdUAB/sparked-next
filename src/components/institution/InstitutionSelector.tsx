'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import useInstitution from '@hooks/useInstitution';
import useDebounceValue from '@hooks/use-debounce';
import { HiPlus, HiSearch } from 'react-icons/hi';
import i18next from 'i18next';

interface InstitutionSelectorProps {
  selectedInstitutionId?: string;
  onInstitutionSelect: (institutionId: string | null, institutionName?: string) => void;
  error?: string;
  disabled?: boolean;
  isOptional?: boolean;
}

const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({
  selectedInstitutionId,
  onInstitutionSelect,
  error,
  disabled = false,
  isOptional = false,
}) => {
  const { fetchPublicInstitutions, publicInstitutions, createInstitution, isLoading } = useInstitution();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInstitutionData, setNewInstitutionData] = useState({
    name: '',
    type: 'school' as const,
    description: '',
    website: '',
    address: '',
    contact_email: '',
  });
  const [isCreatingInstitution, setIsCreatingInstitution] = useState(false);
  const [isFetchingInstitutions, setIsFetchingInstitutions] = useState(false);

  // Debounce the search term with a 500ms delay
  const debouncedSearchTerm = useDebounceValue(searchTerm, 500);

  useEffect(() => {
    // Load public institutions on component mount
    setIsFetchingInstitutions(true);
    fetchPublicInstitutions().finally(() => setIsFetchingInstitutions(false));
  }, [fetchPublicInstitutions]);

  // Effect to handle debounced search
  useEffect(() => {
    // Skip initial empty search to avoid duplicate API call on mount
    if (debouncedSearchTerm === '' && searchTerm === '') {
      return;
    }

    setIsFetchingInstitutions(true);
    fetchPublicInstitutions(debouncedSearchTerm || '').finally(() => setIsFetchingInstitutions(false));
  }, [debouncedSearchTerm, searchTerm, fetchPublicInstitutions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'create_new') {
      setShowCreateModal(true);
      return;
    }

    if (value === '') {
      onInstitutionSelect(null);
      return;
    }

    const selectedInstitution = publicInstitutions.find(inst => inst._id === value);
    onInstitutionSelect(value, selectedInstitution?.name);
  };

  const handleCreateInstitution = async () => {
    if (!newInstitutionData.name.trim()) {
      return;
    }

    setIsCreatingInstitution(true);
    try {
      const result = await createInstitution({
        ...newInstitutionData,
        is_verified: false, // User-created institutions need admin approval
      });

      if (result && result.institutionId) {
        // Select the newly created institution
        onInstitutionSelect(result.institutionId, newInstitutionData.name);

        // Close modal and reset form
        setShowCreateModal(false);
        setNewInstitutionData({
          name: '',
          type: 'school',
          description: '',
          website: '',
          address: '',
          contact_email: '',
        });

        // Refresh the institutions list
        fetchPublicInstitutions();
      }
    } finally {
      setIsCreatingInstitution(false);
    }
  };

  const handleNewInstitutionChange = (field: string, value: string) => {
    setNewInstitutionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1.5 block">
          <Label htmlFor="institution-search" className="text-gray-700 dark:text-gray-300">{i18next.t('search_institution')}</Label>
        </div>
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="institution-search"
            className="pl-9 rounded-lg"
            placeholder={i18next.t('search_institution_placeholder')}
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <div className="mb-1.5 block">
          <Label htmlFor="institution-select" className="block mb-2 text-sm font-medium text-gray-900">
            {i18next.t('institution_label')} {!isOptional && "*"}
          </Label>
        </div>
        <select
          id="institution-select"
          value={selectedInstitutionId || ''}
          onChange={handleInstitutionChange}
          disabled={disabled || isLoading || isFetchingInstitutions}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">
            {isFetchingInstitutions
              ? i18next.t('loading_institutions')
              : (isOptional ? i18next.t('select_institution_optional') : i18next.t('select_institution'))
            }
          </option>
          {!isFetchingInstitutions && publicInstitutions.map((institution) => (
            <option key={institution._id} value={institution._id}>
              {institution.name} ({institution.type})
            </option>
          ))}
          {!isFetchingInstitutions && (
            <option value="create_new" className="font-semibold text-blue-600">
              + {i18next.t('create_new_institution')}
            </option>
          )}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      {/* Create New Institution Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{i18next.t('create_new_institution')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Can&apos;t find your institution? Create a new one. It will be reviewed by our team for verification.
            </p>

            <div>
              <Label htmlFor="new-institution-name">Institution Name *</Label>
              <Input
                id="new-institution-name"
                value={newInstitutionData.name}
                onChange={(e) => handleNewInstitutionChange('name', e.target.value)}
                placeholder="Enter institution name"
                required
              />
            </div>

            <div>
              <Label htmlFor="new-institution-type">Institution Type *</Label>
              <select
                id="new-institution-type"
                value={newInstitutionData.type}
                onChange={(e) => handleNewInstitutionChange('type', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="university">University</option>
                <option value="organization">Organization</option>
              </select>
            </div>

            <div>
              <Label htmlFor="new-institution-description">Description</Label>
              <Input
                id="new-institution-description"
                value={newInstitutionData.description}
                onChange={(e) => handleNewInstitutionChange('description', e.target.value)}
                placeholder="Brief description (optional)"
              />
            </div>

            <div>
              <Label htmlFor="new-institution-website">Website</Label>
              <Input
                id="new-institution-website"
                type="url"
                value={newInstitutionData.website}
                onChange={(e) => handleNewInstitutionChange('website', e.target.value)}
                placeholder="https://example.com (optional)"
              />
            </div>

            <div>
              <Label htmlFor="new-institution-address">Address</Label>
              <Input
                id="new-institution-address"
                value={newInstitutionData.address}
                onChange={(e) => handleNewInstitutionChange('address', e.target.value)}
                placeholder="Institution address (optional)"
              />
            </div>

            <div>
              <Label htmlFor="new-institution-email">Contact Email</Label>
              <Input
                id="new-institution-email"
                type="email"
                value={newInstitutionData.contact_email}
                onChange={(e) => handleNewInstitutionChange('contact_email', e.target.value)}
                placeholder="contact@institution.com (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateInstitution}
              disabled={!newInstitutionData.name.trim() || isCreatingInstitution}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isCreatingInstitution ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <HiPlus className="mr-2 h-4 w-4" />
                  Create Institution
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstitutionSelector;

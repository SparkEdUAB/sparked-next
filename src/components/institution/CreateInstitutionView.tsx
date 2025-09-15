'use client';

import useInstitution from '@hooks/useInstitution';
import { Button, Spinner, Label, TextInput, Select, Textarea } from 'flowbite-react';
import { FormEventHandler, useState } from 'react';
import { extractValuesFromFormEvent } from 'utils/helpers/extractValuesFromFormEvent';
import { T_CreateInstitutionFields } from '@hooks/useInstitution/types';

const INSTITUTION_FORM_FIELDS = {
  name: { key: 'name', label: 'Institution Name' },
  type: { key: 'type', label: 'Institution Type' },
  description: { key: 'description', label: 'Description' },
  website: { key: 'website', label: 'Website' },
  address: { key: 'address', label: 'Address' },
  contact_email: { key: 'contact_email', label: 'Contact Email' },
  contact_phone: { key: 'contact_phone', label: 'Contact Phone' },
};

const CreateInstitutionView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createInstitution, isLoading } = useInstitution();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors({});

    const keys = Object.keys(INSTITUTION_FORM_FIELDS).map(key => INSTITUTION_FORM_FIELDS[key as keyof typeof INSTITUTION_FORM_FIELDS].key);
    let result = extractValuesFromFormEvent<T_CreateInstitutionFields>(e, keys);

    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!result.name?.trim()) {
      newErrors.name = 'Institution name is required';
    }
    
    if (!result.type) {
      newErrors.type = 'Institution type is required';
    }
    
    if (result.website && !result.website.match(/^https?:\/\//)) {
      newErrors.website = 'Website must start with http:// or https://';
    }
    
    if (result.contact_email && !result.contact_email.includes('@')) {
      newErrors.contact_email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Set default verification status for admin-created institutions
    result.is_verified = true;

    const success = await createInstitution(result, onSuccessfullyDone);
    if (success) {
      onSuccessfullyDone?.();
    }
  };

  return (
    <form className="flex flex-col items-start space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value={INSTITUTION_FORM_FIELDS.name.label + ' *'} />
          </div>
          <TextInput
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.name.key}
            id="name"
            placeholder="Enter institution name"
            required
            color={errors.name ? "failure" : undefined}
            helperText={errors.name}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="type" value={INSTITUTION_FORM_FIELDS.type.label + ' *'} />
          </div>
          <Select
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.type.key}
            id="type"
            required
            color={errors.type ? "failure" : undefined}
            helperText={errors.type}
          >
            <option value="">Select Type</option>
            <option value="school">School</option>
            <option value="college">College</option>
            <option value="university">University</option>
            <option value="organization">Organization</option>
          </Select>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-2 block">
          <Label htmlFor="description" value={INSTITUTION_FORM_FIELDS.description.label} />
        </div>
        <Textarea
          disabled={isLoading}
          name={INSTITUTION_FORM_FIELDS.description.key}
          id="description"
          placeholder="Brief description of the institution"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="website" value={INSTITUTION_FORM_FIELDS.website.label} />
          </div>
          <TextInput
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.website.key}
            id="website"
            type="url"
            placeholder="https://example.com"
            color={errors.website ? "failure" : undefined}
            helperText={errors.website}
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="contact_email" value={INSTITUTION_FORM_FIELDS.contact_email.label} />
          </div>
          <TextInput
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.contact_email.key}
            id="contact_email"
            type="email"
            placeholder="contact@institution.com"
            color={errors.contact_email ? "failure" : undefined}
            helperText={errors.contact_email}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="contact_phone" value={INSTITUTION_FORM_FIELDS.contact_phone.label} />
          </div>
          <TextInput
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.contact_phone.key}
            id="contact_phone"
            type="tel"
            placeholder="+1234567890"
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="address" value={INSTITUTION_FORM_FIELDS.address.label} />
          </div>
          <TextInput
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.address.key}
            id="address"
            placeholder="Institution address"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full md:w-auto"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Creating...
          </>
        ) : (
          'Create Institution'
        )}
      </Button>
    </form>
  );
};

export default CreateInstitutionView;
'use client';

import useInstitution from '@hooks/useInstitution';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
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

const INSTITUTION_TYPES = [
  { value: 'school', label: 'School' },
  { value: 'college', label: 'College' },
  { value: 'university', label: 'University' },
  { value: 'organization', label: 'Organization' },
];

const CreateInstitutionView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: () => void }) => {
  const { createInstitution, isLoading } = useInstitution();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedType, setSelectedType] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors({});

    const keys = Object.keys(INSTITUTION_FORM_FIELDS).map(
      (key) => INSTITUTION_FORM_FIELDS[key as keyof typeof INSTITUTION_FORM_FIELDS].key,
    );
    const result = extractValuesFromFormEvent<T_CreateInstitutionFields>(e, keys);

    // Inject the controlled select value
    result.type = selectedType as T_CreateInstitutionFields['type'];

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
        <div className="space-y-1.5">
          <Label htmlFor="name">{INSTITUTION_FORM_FIELDS.name.label} *</Label>
          <Input
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.name.key}
            id="name"
            placeholder="Enter institution name"
            required
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="type">{INSTITUTION_FORM_FIELDS.type.label} *</Label>
          <Select
            disabled={isLoading}
            value={selectedType}
            onValueChange={setSelectedType}
            required
          >
            <SelectTrigger id="type" className={errors.type ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {INSTITUTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
        </div>
      </div>

      <div className="w-full space-y-1.5">
        <Label htmlFor="description">{INSTITUTION_FORM_FIELDS.description.label}</Label>
        <Textarea
          disabled={isLoading}
          name={INSTITUTION_FORM_FIELDS.description.key}
          id="description"
          placeholder="Brief description of the institution"
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="space-y-1.5">
          <Label htmlFor="website">{INSTITUTION_FORM_FIELDS.website.label}</Label>
          <Input
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.website.key}
            id="website"
            type="url"
            placeholder="https://example.com"
            className={errors.website ? 'border-destructive' : ''}
          />
          {errors.website && <p className="text-xs text-destructive">{errors.website}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contact_email">{INSTITUTION_FORM_FIELDS.contact_email.label}</Label>
          <Input
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.contact_email.key}
            id="contact_email"
            type="email"
            placeholder="contact@institution.com"
            className={errors.contact_email ? 'border-destructive' : ''}
          />
          {errors.contact_email && (
            <p className="text-xs text-destructive">{errors.contact_email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="space-y-1.5">
          <Label htmlFor="contact_phone">{INSTITUTION_FORM_FIELDS.contact_phone.label}</Label>
          <Input
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.contact_phone.key}
            id="contact_phone"
            type="tel"
            placeholder="+1234567890"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">{INSTITUTION_FORM_FIELDS.address.label}</Label>
          <Input
            disabled={isLoading}
            name={INSTITUTION_FORM_FIELDS.address.key}
            id="address"
            placeholder="Institution address"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

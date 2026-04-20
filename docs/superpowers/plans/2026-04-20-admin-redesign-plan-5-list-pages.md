# Admin Redesign — Plan 5: List Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Flowbite Modal/Drawer/Button in every admin list view with DataTable + FormSheet + shadcn Button. Update all create/edit form views to use FormInput, FormTextarea, FormSelect instead of AdminFormInput/Textarea/Selector.

**Architecture:** Each list view follows the same pattern:
1. Remove `import { Drawer, Modal, Button, ... } from 'flowbite-react'`
2. Replace `AdminTable` → `DataTable`
3. Replace Flowbite `Modal` (create) → `FormSheet`
4. Replace Flowbite `Drawer` (edit) → `FormSheet`
5. Remove `AdminPageTitle` → inline `<h1>` with page title
6. Update create/edit view files: `AdminFormInput` → `FormInput`, etc.

**Prerequisite:** Plans 1–4 complete.

---

### Task 1: Grades list view + form views

**Files:**
- Modify: `src/components/grades/gradeListView.tsx`
- Modify: `src/components/grades/createGradeView.tsx`
- Modify: `src/components/grades/editGradeView.tsx`

- [ ] **Step 1: Read existing create and edit views to understand their form fields**

```bash
cat src/components/grades/createGradeView.tsx
cat src/components/grades/editGradeView.tsx
```

Note which `AdminFormInput`, `AdminFormTextarea`, `AdminFormSelector` props each uses.

- [ ] **Step 2: Update createGradeView.tsx**

Replace every occurrence of:
- `import { ... } from 'flowbite-react'` → remove if only used for Label/TextInput/Textarea/Select
- `AdminFormInput` → `FormInput` from `@components/admin/form/FormInput`
- `AdminFormTextarea` → `FormTextarea` from `@components/admin/form/FormTextarea`
- `AdminFormSelector` → `FormSelect` from `@components/admin/form/FormSelect`

Add imports at top of file:
```tsx
import { FormInput } from '@components/admin/form/FormInput';
import { FormTextarea } from '@components/admin/form/FormTextarea';
import { FormSelect } from '@components/admin/form/FormSelect';
```

Replace all `<AdminFormInput ... />` with `<FormInput ... />` (same props — interfaces are identical).
Replace all `<AdminFormTextarea ... />` with `<FormTextarea ... />` (same props).
Replace all `<AdminFormSelector ... />` with `<FormSelect ... />` (same props).

Remove now-unused imports of `AdminFormInput`, `AdminFormTextarea`, `AdminFormSelector`.

- [ ] **Step 3: Apply the same replacements to editGradeView.tsx**

Same substitution pattern as Step 2.

- [ ] **Step 4: Update gradeListView.tsx**

Replace the contents of `src/components/grades/gradeListView.tsx` with:

```tsx
'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useGrade, { transformRawGrade } from '@hooks/useGrade';
import { T_GradeFields } from '@hooks/useGrade/types';
import { gradeTableColumns } from '.';
import EditGradeView from './editGradeView';
import CreateGradeView from './createGradeView';
import i18next from 'i18next';

const GradeListView: React.FC = () => {
  const { selectedGradeIds, setSelectedGradeIds, onSearchQueryChange, deleteGrade, searchQuery } =
    useGrade();
  const [creatingGrade, setCreatingGrade] = useState(false);
  const [edittingGrade, setEdittingGrade] = useState<T_GradeFields | null>(null);

  const { items: grades, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_GRADES,
    'grades',
    transformRawGrade,
    API_LINKS.FIND_GRADE_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedGradeIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedGradeIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('grades')}</h1>
      </div>

      <DataTable<T_GradeFields>
        deleteItems={async () => { const r = await deleteGrade(); mutate(); return r; }}
        rowSelection={rowSelection}
        items={grades}
        isLoading={isLoading}
        createNew={() => setCreatingGrade(true)}
        editItem={(item) => setEdittingGrade(item)}
        columns={gradeTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      <FormSheet
        open={creatingGrade}
        onClose={() => setCreatingGrade(false)}
        title={`Create ${i18next.t('grades')}`}
      >
        <CreateGradeView
          onSuccessfullyDone={() => { mutate(); setCreatingGrade(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingGrade}
        onClose={() => setEdittingGrade(null)}
        title={`Edit ${i18next.t('grades')}`}
      >
        {edittingGrade && (
          <EditGradeView
            grade={edittingGrade}
            onSuccessfullyDone={() => { mutate(); setEdittingGrade(null); }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default GradeListView;
```

- [ ] **Step 5: Verify no Flowbite imports remain in modified files**

```bash
grep -n "from 'flowbite-react'" \
  src/components/grades/gradeListView.tsx \
  src/components/grades/createGradeView.tsx \
  src/components/grades/editGradeView.tsx
```

Expected: no output (no flowbite imports).

- [ ] **Step 6: Run tests**

```bash
npm run test 2>&1 | tail -15
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/grades/
git commit -m "feat: migrate grades list and form views to DataTable + FormSheet + shadcn forms"
```

---

### Task 2: Subjects list view + form views

**Files:**
- Modify: `src/components/subjects/subjectListView.tsx`
- Modify: `src/components/subjects/createSubjectView.tsx`
- Modify: `src/components/subjects/editSubjectView.tsx`

- [ ] **Step 1: Read existing form views**

```bash
cat src/components/subjects/createSubjectView.tsx
cat src/components/subjects/editSubjectView.tsx
```

- [ ] **Step 2: Update createSubjectView.tsx and editSubjectView.tsx**

Same pattern as Task 1 Step 2–3:
- `AdminFormInput` → `FormInput` (import from `@components/admin/form/FormInput`)
- `AdminFormTextarea` → `FormTextarea` (import from `@components/admin/form/FormTextarea`)
- `AdminFormSelector` → `FormSelect` (import from `@components/admin/form/FormSelect`)
- Remove unused Flowbite imports.

- [ ] **Step 3: Replace subjectListView.tsx**

Replace the contents of `src/components/subjects/subjectListView.tsx` with:

```tsx
'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useSubject, { transformRawSubject } from '@hooks/useSubject';
import { T_SubjectFields } from '@hooks/useSubject/types';
import { subjectTableColumns } from '.';
import EditSubjectView from './editSubjectView';
import CreateSubjectView from './createSubjectView';
import i18next from 'i18next';

const SubjectListView: React.FC = () => {
  const { selectedSubjectIds, setSelectedSubjectIds, onSearchQueryChange, deleteSubject, searchQuery } =
    useSubject();
  const [creatingSubject, setCreatingSubject] = useState(false);
  const [edittingSubject, setEdittingSubject] = useState<T_SubjectFields | null>(null);

  const { items: subjects, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_SUBJECTS,
    'subjects',
    transformRawSubject,
    API_LINKS.FIND_SUBJECT_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedSubjectIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedSubjectIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('subjects')}</h1>
      </div>

      <DataTable<T_SubjectFields>
        deleteItems={async () => { const r = await deleteSubject(); mutate(); return r; }}
        rowSelection={rowSelection}
        items={subjects}
        isLoading={isLoading}
        createNew={() => setCreatingSubject(true)}
        editItem={(item) => setEdittingSubject(item)}
        columns={subjectTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      <FormSheet
        open={creatingSubject}
        onClose={() => setCreatingSubject(false)}
        title={`Create ${i18next.t('subjects')}`}
      >
        <CreateSubjectView
          onSuccessfullyDone={() => { mutate(); setCreatingSubject(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingSubject}
        onClose={() => setEdittingSubject(null)}
        title={`Edit ${i18next.t('subjects')}`}
      >
        {edittingSubject && (
          <EditSubjectView
            subject={edittingSubject}
            onSuccessfullyDone={() => { mutate(); setEdittingSubject(null); }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default SubjectListView;
```

- [ ] **Step 4: Verify no Flowbite imports remain**

```bash
grep -n "from 'flowbite-react'" \
  src/components/subjects/subjectListView.tsx \
  src/components/subjects/createSubjectView.tsx \
  src/components/subjects/editSubjectView.tsx
```

Expected: no output.

- [ ] **Step 5: Run tests and commit**

```bash
npm run test 2>&1 | tail -10
git add src/components/subjects/
git commit -m "feat: migrate subjects list and form views to DataTable + FormSheet + shadcn forms"
```

---

### Task 3: Units list view + form views

**Files:**
- Modify: `src/components/units/unitListView.tsx`
- Modify: `src/components/units/create-unit-view.tsx`
- Modify: `src/components/units/edit-unit-view.tsx`

- [ ] **Step 1: Read existing form views**

```bash
cat src/components/units/create-unit-view.tsx
cat src/components/units/edit-unit-view.tsx
```

- [ ] **Step 2: Update create-unit-view.tsx and edit-unit-view.tsx**

Same form component replacement pattern:
- `AdminFormInput` → `FormInput`
- `AdminFormTextarea` → `FormTextarea`
- `AdminFormSelector` → `FormSelect`

- [ ] **Step 3: Replace unitListView.tsx**

Replace the contents of `src/components/units/unitListView.tsx` with:

```tsx
'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useUnit, { transformRawUnit } from '@hooks/useUnit';
import { T_UnitFields } from '@hooks/useUnit/types';
import { unitTableColumns } from '.';
import CreateUnitView from './create-unit-view';
import EditUnitView from './edit-unit-view';
import i18next from 'i18next';

const UnitListView: React.FC = () => {
  const { selectedUnitIds, setSelectedProgramIds, searchQuery, onSearchQueryChange, deleteUnits } =
    useUnit();
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [edittingUnit, setEdittingUnit] = useState<T_UnitFields | null>(null);

  const { items: units, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_UNITS,
    'units',
    transformRawUnit,
    API_LINKS.FIND_UNITS_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedUnitIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedProgramIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('units')}</h1>
      </div>

      <DataTable<T_UnitFields>
        deleteItems={async () => { const r = await deleteUnits(); mutate(); return r; }}
        rowSelection={rowSelection}
        items={units}
        isLoading={isLoading}
        createNew={() => setCreatingUnit(true)}
        editItem={(id) => setEdittingUnit(id)}
        columns={unitTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      <FormSheet
        open={creatingUnit}
        onClose={() => setCreatingUnit(false)}
        title={`Create ${i18next.t('units')}`}
      >
        <CreateUnitView
          onSuccessfullyDone={() => { mutate(); setCreatingUnit(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingUnit}
        onClose={() => setEdittingUnit(null)}
        title={`Edit ${i18next.t('units')}`}
      >
        {edittingUnit && (
          <EditUnitView
            unit={edittingUnit}
            onSuccessfullyDone={() => { mutate(); setEdittingUnit(null); }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default UnitListView;
```

- [ ] **Step 4: Verify and commit**

```bash
grep -n "from 'flowbite-react'" \
  src/components/units/unitListView.tsx \
  src/components/units/create-unit-view.tsx \
  src/components/units/edit-unit-view.tsx
npm run test 2>&1 | tail -10
git add src/components/units/
git commit -m "feat: migrate units list and form views to DataTable + FormSheet + shadcn forms"
```

---

### Task 4: Topics list view + form views

**Files:**
- Modify: `src/components/topic/topics-list-view.tsx`
- Modify: `src/components/topic/create-topic-view.tsx`
- Modify: `src/components/topic/edit-topic-view.tsx`

- [ ] **Step 1: Read existing form views**

```bash
cat src/components/topic/create-topic-view.tsx
cat src/components/topic/edit-topic-view.tsx
```

- [ ] **Step 2: Update create-topic-view.tsx and edit-topic-view.tsx**

Same form component replacement: `AdminFormInput` → `FormInput`, `AdminFormTextarea` → `FormTextarea`, `AdminFormSelector` → `FormSelect`.

- [ ] **Step 3: Replace topics-list-view.tsx**

Replace the contents of `src/components/topic/topics-list-view.tsx` with:

```tsx
'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useTopic, { transformRawTopic } from '@hooks/use-topic';
import { T_TopicFields } from '@hooks/use-topic/types';
import { topicTableColumns } from '.';
import CreateTopicView from './create-topic-view';
import EditTopicView from './edit-topic-view';
import i18next from 'i18next';

const TopicsListView: React.FC = () => {
  const { selectedTopicIds, setSelectedTopicIds, onSearchQueryChange, deleteTopics, searchQuery } =
    useTopic();
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [edittingTopic, setEdittingTopic] = useState<T_TopicFields | null>(null);

  const { items: topics, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_TOPICS,
    'topics',
    transformRawTopic,
    API_LINKS.FIND_TOPIC_BY_NAME,
    searchQuery,
  );

  const rowSelection = {
    selectedRowKeys: selectedTopicIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedTopicIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('topics')}</h1>
      </div>

      <DataTable<T_TopicFields>
        deleteItems={async () => { const r = await deleteTopics(); mutate(); return r; }}
        rowSelection={rowSelection}
        items={topics || []}
        isLoading={isLoading}
        createNew={() => setCreatingTopic(true)}
        editItem={(id) => setEdittingTopic(id)}
        columns={topicTableColumns}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      <FormSheet
        open={creatingTopic}
        onClose={() => setCreatingTopic(false)}
        title={`Create ${i18next.t('topics')}`}
      >
        <CreateTopicView
          onSuccessfullyDone={() => { mutate(); setCreatingTopic(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingTopic}
        onClose={() => setEdittingTopic(null)}
        title={`Edit ${i18next.t('topics')}`}
      >
        {edittingTopic && (
          <EditTopicView
            topic={edittingTopic}
            onSuccessfullyDone={() => { mutate(); setEdittingTopic(null); }}
          />
        )}
      </FormSheet>
    </>
  );
};

export default TopicsListView;
```

- [ ] **Step 4: Verify and commit**

```bash
grep -n "from 'flowbite-react'" \
  src/components/topic/topics-list-view.tsx \
  src/components/topic/create-topic-view.tsx \
  src/components/topic/edit-topic-view.tsx
npm run test 2>&1 | tail -10
git add src/components/topic/
git commit -m "feat: migrate topics list and form views to DataTable + FormSheet + shadcn forms"
```

---

### Task 5: Institutions list view + form views

Institutions has more complexity: create modal, edit modal, reject modal, view-users modal. All Flowbite Modals become FormSheet or Dialog.

**Files:**
- Modify: `src/components/institution/InstitutionsListView.tsx`
- Modify: `src/components/institution/CreateInstitutionView.tsx`
- Modify: `src/components/institution/EditInstitutionView.tsx`

- [ ] **Step 1: Read existing form views**

```bash
cat src/components/institution/CreateInstitutionView.tsx
cat src/components/institution/EditInstitutionView.tsx
```

- [ ] **Step 2: Update CreateInstitutionView.tsx and EditInstitutionView.tsx**

Replace `AdminFormInput` → `FormInput`, `AdminFormTextarea` → `FormTextarea`, `AdminFormSelector` → `FormSelect`. Remove Flowbite imports for Label/TextInput/Textarea/Select if only used via admin form components.

- [ ] **Step 3: Replace InstitutionsListView.tsx**

Replace the contents of `src/components/institution/InstitutionsListView.tsx` with:

```tsx
'use client';

import React, { useState, useMemo } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useInstitution, { transformRawInstitution } from '@hooks/useInstitution';
import { T_InstitutionFields } from '@hooks/useInstitution/types';
import { institutionTableColumnsWithActions } from './index';
import CreateInstitutionView from './CreateInstitutionView';
import EditInstitutionView from './EditInstitutionView';
import InstitutionUsersView from './InstitutionUsersView';
import i18next from 'i18next';

const InstitutionsListView: React.FC = () => {
  const {
    selectedInstitutionIds,
    setSelectedInstitutionIds,
    onSearchQueryChange,
    deleteInstitutions,
    searchQuery,
    approveInstitution,
    rejectInstitution,
    isLoading: isProcessing,
  } = useInstitution();

  const [creatingInstitution, setCreatingInstitution] = useState(false);
  const [edittingInstitution, setEdittingInstitution] = useState<T_InstitutionFields | null>(null);
  const [rejectingInstitution, setRejectingInstitution] = useState<T_InstitutionFields | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [viewingUsersFor, setViewingUsersFor] = useState<T_InstitutionFields | null>(null);

  const handleApprove = async (institution: T_InstitutionFields) => {
    const success = await approveInstitution(institution._id);
    if (success) mutate();
  };

  const handleReject = (institution: T_InstitutionFields) => {
    setRejectingInstitution(institution);
  };

  const confirmReject = async () => {
    if (rejectingInstitution) {
      const success = await rejectInstitution(rejectingInstitution._id, rejectionReason);
      if (success) {
        setRejectingInstitution(null);
        setRejectionReason('');
        mutate();
      }
    }
  };

  const { items: allInstitutions, isLoading, mutate, loadMore, hasMore, error } =
    useAdminListViewData(
      API_LINKS.FETCH_INSTITUTIONS,
      'institutions',
      transformRawInstitution,
      API_LINKS.FIND_INSTITUTIONS_BY_NAME,
      searchQuery,
    );

  const institutions = useMemo(() => {
    if (verificationFilter === 'verified') return allInstitutions.filter((i) => i.is_verified);
    if (verificationFilter === 'pending') return allInstitutions.filter((i) => !i.is_verified);
    return allInstitutions;
  }, [allInstitutions, verificationFilter]);

  const rowSelection = {
    selectedRowKeys: selectedInstitutionIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedInstitutionIds(selectedRowKeys),
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Institutions</h1>
        <div className="flex items-center gap-2">
          <Label htmlFor="verification-filter" className="text-sm">Filter:</Label>
          <Select
            value={verificationFilter}
            onValueChange={(v) => setVerificationFilter(v as typeof verificationFilter)}
          >
            <SelectTrigger id="verification-filter" className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({allInstitutions.length})</SelectItem>
              <SelectItem value="pending">
                Pending ({allInstitutions.filter((i) => !i.is_verified).length})
              </SelectItem>
              <SelectItem value="verified">
                Verified ({allInstitutions.filter((i) => i.is_verified).length})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable<T_InstitutionFields>
        deleteItems={async () => { const r = await deleteInstitutions(); mutate(); return !!r; }}
        rowSelection={rowSelection}
        items={institutions}
        isLoading={isLoading}
        createNew={() => setCreatingInstitution(true)}
        editItem={(item) => setEdittingInstitution(item)}
        columns={institutionTableColumnsWithActions(handleApprove, handleReject, isProcessing, setViewingUsersFor)}
        onSearchQueryChange={onSearchQueryChange}
        hasMore={hasMore}
        loadMore={loadMore}
        error={error}
      />

      {/* Create */}
      <FormSheet
        open={creatingInstitution}
        onClose={() => setCreatingInstitution(false)}
        title={i18next.t('create_institution')}
      >
        <CreateInstitutionView
          onSuccessfullyDone={() => { setCreatingInstitution(false); mutate(); }}
        />
      </FormSheet>

      {/* Edit */}
      <FormSheet
        open={!!edittingInstitution}
        onClose={() => setEdittingInstitution(null)}
        title={i18next.t('edit_institution')}
      >
        {edittingInstitution && (
          <EditInstitutionView
            institution={edittingInstitution}
            onSuccessfullyDone={() => { setEdittingInstitution(null); mutate(); }}
          />
        )}
      </FormSheet>

      {/* Reject dialog */}
      <Dialog open={!!rejectingInstitution} onOpenChange={(v) => !v && setRejectingInstitution(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18next.t('reject_institution')}</DialogTitle>
            <DialogDescription>
              {i18next.t('reject_institution_confirm')}{' '}
              <span className="font-semibold">&quot;{rejectingInstitution?.name}&quot;</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">{i18next.t('rejection_reason_label')}</Label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={i18next.t('rejection_reason_placeholder')}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectingInstitution(null); setRejectionReason(''); }}>
              {i18next.t('cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={isProcessing}>
              {i18next.t('reject_institution')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View users dialog */}
      <Dialog open={!!viewingUsersFor} onOpenChange={(v) => !v && setViewingUsersFor(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Users — {viewingUsersFor?.name}</DialogTitle>
          </DialogHeader>
          {viewingUsersFor && (
            <InstitutionUsersView
              institutionId={viewingUsersFor._id}
              institutionName={viewingUsersFor.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstitutionsListView;
```

- [ ] **Step 4: Verify and commit**

```bash
grep -n "from 'flowbite-react'" \
  src/components/institution/InstitutionsListView.tsx \
  src/components/institution/CreateInstitutionView.tsx \
  src/components/institution/EditInstitutionView.tsx
npm run test 2>&1 | tail -10
git add src/components/institution/
git commit -m "feat: migrate institutions list and form views to DataTable + FormSheet + shadcn"
```

---

### Task 6: Users list view + form views

Users has an extra "Assign to Institution" modal. That becomes a Dialog.

**Files:**
- Modify: `src/components/users/UsersListView.tsx`
- Modify: `src/components/users/create-user-view.tsx`
- Modify: `src/components/users/edit-user-view.tsx`

- [ ] **Step 1: Read existing form views**

```bash
cat src/components/users/create-user-view.tsx
cat src/components/users/edit-user-view.tsx
```

- [ ] **Step 2: Update create-user-view.tsx and edit-user-view.tsx**

Replace `AdminFormInput` → `FormInput`, `AdminFormTextarea` → `FormTextarea`, `AdminFormSelector` → `FormSelect`. Remove Flowbite imports.

- [ ] **Step 3: Replace UsersListView.tsx**

Replace the contents of `src/components/users/UsersListView.tsx` with:

```tsx
'use client';

import React, { useState } from 'react';
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAdminListViewData } from '@hooks/useAdmin/useAdminListViewData';
import { API_LINKS } from 'app/links';
import useUser, { transformRawUser } from '@hooks/useUser';
import { T_UserFields } from '@hooks/useUser/types';
import { userTableColumns } from '.';
import CreateUserView from './create-user-view';
import EditUserView from './edit-user-view';
import useAuth from '@hooks/useAuth';
import useInstitution from '@hooks/useInstitution';
import { HiUserGroup } from 'react-icons/hi';
import i18next from 'i18next';

const UsersListView = () => {
  const { selectedUserIds, setSelectedUserIds, deleteUsers, assignUsersToInstitution } = useUser();
  const [creatingUser, setCreatingUser] = useState(false);
  const [edittingUser, setEdittingUser] = useState<T_UserFields | null>(null);
  const { handleForgotPassword, loading } = useAuth();
  const [resettingPasswordFor, setResettingPasswordFor] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState('');
  const { publicInstitutions, fetchPublicInstitutions } = useInstitution();

  React.useEffect(() => {
    if (showAssignModal && publicInstitutions.length === 0) fetchPublicInstitutions();
  }, [showAssignModal, publicInstitutions.length, fetchPublicInstitutions]);

  const { items: users, isLoading, mutate, loadMore, hasMore, error } = useAdminListViewData(
    API_LINKS.FETCH_USERS,
    'users',
    transformRawUser,
    API_LINKS.FIND_USERS_BY_NAME,
  );

  const rowSelection = {
    selectedRowKeys: selectedUserIds,
    onChange: (selectedRowKeys: React.Key[]) => setSelectedUserIds(selectedRowKeys),
  };

  const handleAssignToInstitution = async () => {
    if (!selectedInstitutionId) return;
    const success = await assignUsersToInstitution(selectedUserIds as string[], selectedInstitutionId);
    if (success) {
      setShowAssignModal(false);
      setSelectedInstitutionId('');
      setSelectedUserIds([]);
      mutate();
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{i18next.t('users')}</h1>
      </div>

      <DataTable<any>
        deleteItems={async () => { const r = await deleteUsers(); mutate(); return r; }}
        rowSelection={rowSelection}
        items={users}
        isLoading={isLoading}
        createNew={() => setCreatingUser(true)}
        editItem={(id) => setEdittingUser(id)}
        additionalButtons={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowAssignModal(true)}
            disabled={selectedUserIds.length === 0}
          >
            <HiUserGroup className="h-4 w-4" />
            Assign to Institution
          </Button>
        }
        columns={userTableColumns.map((col) => {
          if (col.key === 'action') {
            return {
              ...col,
              render: (_: any, record: any) => (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading && resettingPasswordFor === record.email}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setResettingPasswordFor(record.email);
                    handleForgotPassword(record.email, () => setResettingPasswordFor(null));
                  }}
                >
                  {loading && resettingPasswordFor === record.email ? 'Sending...' : 'Reset Password'}
                </Button>
              ),
            };
          }
          return col;
        })}
        loadMore={loadMore}
        hasMore={hasMore}
        error={error}
      />

      <FormSheet open={creatingUser} onClose={() => setCreatingUser(false)} title="Create User">
        <CreateUserView
          onSuccessfullyDone={() => { mutate(); setCreatingUser(false); }}
        />
      </FormSheet>

      <FormSheet
        open={!!edittingUser}
        onClose={() => setEdittingUser(null)}
        title="Edit User"
      >
        {edittingUser && (
          <EditUserView
            user={edittingUser}
            onSuccessfullyDone={() => { mutate(); setEdittingUser(null); }}
          />
        )}
      </FormSheet>

      {/* Assign to Institution */}
      <Dialog open={showAssignModal} onOpenChange={(v) => !v && setShowAssignModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Users to Institution</DialogTitle>
            <DialogDescription>
              Assign {selectedUserIds.length} selected user(s) to an institution.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="institution-select">Select Institution</Label>
            <Select value={selectedInstitutionId} onValueChange={setSelectedInstitutionId}>
              <SelectTrigger id="institution-select">
                <SelectValue placeholder="Choose an institution..." />
              </SelectTrigger>
              <SelectContent>
                {publicInstitutions
                  .filter((inst) => inst.is_verified)
                  .map((institution) => (
                    <SelectItem key={institution._id} value={institution._id}>
                      {institution.name} ({institution.type})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignToInstitution} disabled={!selectedInstitutionId}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersListView;
```

- [ ] **Step 4: Verify and commit**

```bash
grep -n "from 'flowbite-react'" \
  src/components/users/UsersListView.tsx \
  src/components/users/create-user-view.tsx \
  src/components/users/edit-user-view.tsx
npm run test 2>&1 | tail -10
git add src/components/users/
git commit -m "feat: migrate users list and form views to DataTable + FormSheet + shadcn"
```

---

### Task 7: Media Content list view + form views

Media Content has create modal, upload-multiple modal, and edit drawer. The upload-multiple modal becomes a Dialog (it's a large form, not a simple sheet).

**Files:**
- Modify: `src/components/media-content/media-content-list-view.tsx`
- Modify: `src/components/media-content/create-media-content-view.tsx`
- Modify: `src/components/media-content/edit-media-content-view.tsx`

- [ ] **Step 1: Read existing form views**

```bash
cat src/components/media-content/create-media-content-view.tsx
cat src/components/media-content/edit-media-content-view.tsx
```

- [ ] **Step 2: Update create-media-content-view.tsx and edit-media-content-view.tsx**

Replace `AdminFormInput` → `FormInput`, `AdminFormTextarea` → `FormTextarea`, `AdminFormSelector` → `FormSelect`. Remove Flowbite imports.

- [ ] **Step 3: Replace media-content-list-view.tsx**

Replace the contents of `src/components/media-content/media-content-list-view.tsx` with:

```tsx
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
```

- [ ] **Step 4: Verify and commit**

```bash
grep -n "from 'flowbite-react'" \
  src/components/media-content/media-content-list-view.tsx \
  src/components/media-content/create-media-content-view.tsx \
  src/components/media-content/edit-media-content-view.tsx
npm run test 2>&1 | tail -10
git add src/components/media-content/
git commit -m "feat: migrate media content list and form views to DataTable + FormSheet + shadcn"
```

---

### Task 8: Settings pages (Pages + Roles)

**Files:**
- Modify: `src/components/pages/PagesListView.tsx`
- Modify: `src/components/pages/create-page-view.tsx`
- Modify: `src/components/pages/edit-page-view.tsx`
- Modify: `src/components/roles/RolesListView.tsx`
- Modify: `src/components/roles/create-role-view.tsx`
- Modify: `src/components/roles/edit-role-view.tsx`

- [ ] **Step 1: Read all six files**

```bash
cat src/components/pages/PagesListView.tsx
cat src/components/pages/create-page-view.tsx
cat src/components/pages/edit-page-view.tsx
cat src/components/roles/RolesListView.tsx
cat src/components/roles/create-role-view.tsx
cat src/components/roles/edit-role-view.tsx
```

- [ ] **Step 2: Update all four form view files**

For `create-page-view.tsx`, `edit-page-view.tsx`, `create-role-view.tsx`, `edit-role-view.tsx`:
Replace `AdminFormInput` → `FormInput`, `AdminFormTextarea` → `FormTextarea`, `AdminFormSelector` → `FormSelect`. Remove Flowbite imports.

- [ ] **Step 3: Replace PagesListView.tsx**

After reading the file in Step 1, apply the same DataTable + FormSheet pattern. The structure will match the grades/subjects pattern — replace AdminTable with DataTable, Flowbite Drawer/Modal with FormSheet, AdminPageTitle with inline `<h1>`.

Use this import block as your guide:
```tsx
import { DataTable } from '@components/admin/data-table/DataTable';
import { FormSheet } from '@components/admin/form/FormSheet';
```

Replace `AdminPageTitle` with:
```tsx
<div className="mb-6">
  <h1 className="text-2xl font-bold text-foreground">Pages</h1>
</div>
```

- [ ] **Step 4: Replace RolesListView.tsx**

Same pattern as PagesListView. Replace AdminTable + Flowbite modals with DataTable + FormSheet.

- [ ] **Step 5: Verify no Flowbite imports remain in settings components**

```bash
grep -rn "from 'flowbite-react'" \
  src/components/pages/ \
  src/components/roles/
```

Expected: no output.

- [ ] **Step 6: Run full test suite**

```bash
npm run test 2>&1 | tail -20
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/components/pages/ src/components/roles/
git commit -m "feat: migrate settings (pages + roles) list views to DataTable + FormSheet + shadcn"
```

---

### Task 9: Update AdminTableButtonGroup tests + final audit

The `AdminTableButtonGroup` component is now only used internally by `DataTable` (which wraps `DeletionWarningModal`). Its test still mocks Flowbite. Update it to stay green.

**Files:**
- Modify: `src/components/admin/AdminTable/AdminTableButtonGroup.test.tsx`

- [ ] **Step 1: Check if AdminTableButtonGroup is still imported anywhere**

```bash
grep -rn "AdminTableButtonGroup" src/
```

If it's only imported by `AdminTable.tsx` (which is being superseded by DataTable), note that both can coexist during transition.

- [ ] **Step 2: Verify final Flowbite import audit in admin components**

```bash
grep -rn "from 'flowbite-react'" \
  src/components/admin/ \
  src/app/admin/
```

Expected output (allowed): only `AdminTable.tsx` and `AdminTableButtonGroup.tsx` (legacy, no longer used by list pages). Everything else should be clean.

- [ ] **Step 3: Run full test suite one final time**

```bash
npm run test 2>&1 | grep -E "(PASS|FAIL|Tests)" | tail -20
```

Expected: all test files PASS, zero failures.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: final cleanup and audit after admin redesign migration"
```

---

### Plan 5 Complete — Full Admin Redesign Done

All admin list views, form views, shell, and dashboard now use shadcn/ui + Recharts. Flowbite remains only in non-admin pages.

**Summary of what changed:**
- `src/components/admin/layout/` — 5 new components (AdminShell, AdminSidebar, AdminTopbar, AdminBreadcrumb, ThemeToggle, UserDropdown)
- `src/components/admin/dashboard/` — 4 new components (StatsCard, EntityBarChart, GrowthLineChart, RecentActivityTable)
- `src/components/admin/data-table/` — 4 new components (DataTable, DataTableSkeleton, DataTableEmptyState, DataTableLoadMore)
- `src/components/admin/form/` — 4 new components (FormInput, FormTextarea, FormSelect, FormSheet)
- `src/components/admin/AdminTable/DeletionWarningModal.tsx` — updated in-place
- 8 list view files updated (grades, subjects, units, topics, institutions, users, media-content, pages+roles)
- 14 create/edit form view files updated

**Proceed to Plan 2 (Phase 2) when ready:** login, signup, landing page, library, media view — full Flowbite removal.

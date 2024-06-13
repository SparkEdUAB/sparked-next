'use client';

import ContentPlaceholder from '@components/atom/ContentPlaceholder/ContentPlaceholder';
import { AdminPageTitle } from '@components/layouts';
import i18next from 'i18next';

const UsersListView = () => {
  return (
    <>
      <AdminPageTitle title={i18next.t('users')} />

      <ContentPlaceholder message="User management has not been implemented yet" />

      {/* <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_users')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findUsersByName({ withMetaData: true }) : null;
        }}
      />
      <AdminTable<T_UserFields>
        deleteItems={deleteUsers}
        rowSelection={rowSelection}
        items={users || []}
        isLoading={isLoading}
        //createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.users)}
        //getEditUrl={(id: string) => getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${id}`}
        createNew={() => setCreatingUser(true)}
        editItem={(id) => setEdittingUserWithId(id)}
        columns={userTableColumns}
      /> */}
      {/*<Modal dismissible show={creatingUser} onClose={() => setCreatingUser(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateUserView
            onSuccessfullyDone={() => {
              fetchUsers({});
              setCreatingUser(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Modal dismissible show={!!edittingUserWithId} onClose={() => setEdittingUserWithId(null)} popup>
        <Modal.Header />
        <Modal.Body>
          {edittingUserWithId ? (
            <EditUserView
              courseId={edittingUserWithId}
              onSuccessfullyDone={() => {
                fetchUsers({});
                setEdittingUserWithId(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>*/}
    </>
  );
};

export default UsersListView;

'use client';

import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { API_LINKS } from 'app/links';
import { T_UserFields } from '@hooks/useUser/types';
import { transformRawUser } from '@hooks/useUser';
import { AdminTable } from '@components/admin/AdminTable/AdminTable';
import { userTableColumns } from '@components/users';
import i18next from 'i18next';

interface InstitutionUsersViewProps {
  institutionId: string;
  institutionName: string;
}

const InstitutionUsersView: React.FC<InstitutionUsersViewProps> = ({ institutionId, institutionName }) => {
  const [users, setUsers] = useState<T_UserFields[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchUsers = async (skipValue: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_LINKS.FETCH_INSTITUTION_USERS}?institutionId=${institutionId}&limit=${limit}&skip=${skipValue}`
      );
      const data = await response.json();

      if (!data.isError) {
        const transformedUsers = data.users.map((user: any, index: number) => ({
          ...transformRawUser(user),
          index: skipValue + index + 1,
          key: user._id,
        }));

        if (skipValue === 0) {
          setUsers(transformedUsers);
        } else {
          setUsers((prev) => [...prev, ...transformedUsers]);
        }

        setHasMore(data.users.length === limit);
      }
    } catch (error) {
      console.error('Error fetching institution users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0);
  }, [institutionId]);

  const loadMore = () => {
    const newSkip = skip + limit;
    setSkip(newSkip);
    fetchUsers(newSkip);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Users assigned to {institutionName}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Total: {users.length} user(s)
        </span>
      </div>

      {isLoading && users.length === 0 ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No users assigned to this institution yet.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Name</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Phone</th>
                  <th scope="col" className="px-6 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phoneNumber || '-'}</td>
                    <td className="px-6 py-4">{user.role || 'Student'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div className="flex justify-center py-4">
              <Button onClick={loadMore} isProcessing={isLoading}>
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstitutionUsersView;

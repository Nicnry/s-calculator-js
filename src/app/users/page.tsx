'use client';

import UserListWrapper from '@/components/users/usersListWrapper';

export default function UsersPageLayout() {
  return (
    <div className="container mx-auto px-4 py-8">
      <UserListWrapper />
    </div>
  );
}

import { User } from '@/types/user';
import { UserCard } from './UserCard';
import { memo } from 'react';

interface UserListProps {
  users: User[];
  searchQuery?: string;
}

export function UserListComponent({ users, searchQuery = '' }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          {searchQuery
            ? `نتیجه‌ای برای "${searchQuery}" یافت نشد`
            : 'کاربری یافت نشد'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" >
      {users.map((user) => (
        <UserCard key={user.id} user={user} searchQuery={searchQuery} />
      ))}
    </div>
  );
}

export const UserList = memo(UserListComponent);
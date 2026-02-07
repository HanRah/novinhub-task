import { memo } from 'react';
import { User } from '@/types/user';
import { HighlightText } from './HighlightText';

interface UserCardProps {
  user: User;
  searchQuery?: string;
}

function UserCardComponent({ user, searchQuery = '' }: UserCardProps) {
  return (
    <article className="p-5 bg-white rounded-lg border border-gray-200 
                    hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
      <HighlightText text={user.name} query={searchQuery} />
      </h3>
      
      <div className="space-y-1.5">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="font-medium">ایمیل:</span>
          <span className="break-all">
          <HighlightText text={user.email} query={searchQuery} />
          </span>
        </p>
        
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <span className="font-medium">شرکت:</span>
          <span>{user.company.name}</span>
        </p>
      </div>
    </article>
  );
}

export const UserCard = memo(UserCardComponent);


'use client';

import { useDeferredValue, useState } from 'react';
import { usePaginatedUsers } from '@/hooks/usePaginatedUsers';
import { SearchInput } from '@/components/SearchInput';
import { UserList } from '@/components/UserList';
import { Pagination } from '@/components/Pagination';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { User } from '@/types/user';

interface HomeClientProps {
  initialUsers: User[];
  initialError: string | null;
}

export default function HomeClient({ initialUsers, initialError }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const deferredSearch = useDeferredValue(searchQuery);
  const isSearchStale = searchQuery !== deferredSearch;

  const {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    goToPage,
    nextPage,
    previousPage,
    retry,
  } = usePaginatedUsers({
    searchQuery: deferredSearch,
    pageSize: 5,
    initialUsers,
    initialError,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            لیست کاربران
          </h1>
          <p className="text-gray-600">
            جستجو و مشاهده اطلاعات کاربران
          </p>
        </header>

        <div className="mb-6">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
          />
          {!loading && totalCount > 0 && (
            <p className="mt-2 text-sm text-gray-500"  >
              {totalCount.toLocaleString()} نتیجه
              {totalPages > 1 && ` • صفحه ${currentPage} از ${totalPages}`}
            </p>
          )}
         {isSearchStale && (
            <p className="mt-1 text-xs text-gray-400">
              در حال جستجو...
            </p>
          )}
        </div>

        <main>
          {loading && <LoadingSpinner />}

          {error && !loading && <ErrorMessage message={error} onRetry={retry} />}

          {!loading && !error && (
             <div style={{ opacity: isSearchStale ? 0.7 : 1, transition: 'opacity 200ms' }}>

              <UserList users={users} searchQuery={deferredSearch} />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                onNext={nextPage}
                onPrevious={previousPage}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
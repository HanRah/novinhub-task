import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { User } from '@/types/user';

interface UsePaginatedUsersOptions {
  searchQuery: string;
  pageSize?: number;
  initialUsers?: User[];
  initialError?: string | null;
}

export function usePaginatedUsers({ searchQuery, pageSize = 5, initialUsers = [],
  initialError = null, }: UsePaginatedUsersOptions) {
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(initialUsers.length === 0 && !initialError);
  const [error, setError] = useState<string | null>(initialError);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUsers = useCallback(async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }

      const data: User[] = await response.json();
      setAllUsers(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const errorMessage = err instanceof Error
        ? err.message
        : 'Unknown error fetching data';
      setError(errorMessage);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (initialUsers.length === 0 && !initialError) {
      fetchUsers();
    }
    return () => abortControllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return allUsers;

    const searchLower = searchQuery.toLowerCase().trim();
    return allUsers.filter((user) =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }, [allUsers, searchQuery]);

  const totalCount = filteredUsers.length;
  const totalPages = Math.ceil(totalCount / pageSize);


  const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

  const users = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * pageSize;
    return filteredUsers.slice(startIdx, startIdx + pageSize);
  }, [filteredUsers, safeCurrentPage, pageSize]);

  const goToPage = useCallback((pageNum: number) => {
    setCurrentPage((prev) => {
      if (pageNum >= 1 && pageNum <= totalPages && pageNum !== prev) {
        return pageNum;
      }
      return prev;
    });
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  return {
    users,
    loading,
    error,
    currentPage: safeCurrentPage,
    totalPages,
    totalCount,
    goToPage,
    nextPage,
    previousPage,
    retry: fetchUsers,
  };
}
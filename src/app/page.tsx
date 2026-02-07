import { User } from '@/types/user';
import HomeClient from './HomeClient';

async function getUsers(): Promise<User[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) throw new Error(`Error fetching data: ${res.status}`);
  return res.json();
}

export default async function Home() {
  let initialUsers: User[] = [];
  let initialError: string | null = null;

  try {
    initialUsers = await getUsers();
  } catch (err) {
    initialError = err instanceof Error ? err.message : 'Unknown error fetching data';
  }

  return <HomeClient initialUsers={initialUsers} initialError={initialError} />;
}
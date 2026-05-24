import 'server-only';

import type { User } from './types';

/**
 * In-memory mock store.
 *
 * This template ships with no backend, so the `users` feature uses a
 * module-scoped `Map` as its "database". The map survives across server
 * action calls within the same dev server process but resets on full
 * restart — that's fine for a template.
 *
 * To wire a real backend:
 *   1. Replace the `users` Map with calls to your DB / API.
 *   2. Keep the action signatures (they already return `Result<T>` and
 *      validate input with Zod) — your pages won't change.
 */
const initialUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'admin',
    active: true,
    created_at: '2026-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'editor',
    active: true,
    created_at: '2026-01-22T14:15:00Z',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    role: 'editor',
    active: true,
    created_at: '2026-02-03T09:45:00Z',
  },
  {
    id: '4',
    name: 'Dan Wilson',
    email: 'dan@example.com',
    role: 'viewer',
    active: true,
    created_at: '2026-02-11T16:20:00Z',
  },
  {
    id: '5',
    name: 'Eve Martinez',
    email: 'eve@example.com',
    role: 'viewer',
    active: false,
    created_at: '2026-02-18T11:00:00Z',
  },
  {
    id: '6',
    name: 'Frank Brown',
    email: 'frank@example.com',
    role: 'user',
    active: true,
    created_at: '2026-03-01T08:10:00Z',
  },
  {
    id: '7',
    name: 'Grace Lee',
    email: 'grace@example.com',
    role: 'editor',
    active: true,
    created_at: '2026-03-09T13:25:00Z',
  },
  {
    id: '8',
    name: 'Henry Clark',
    email: 'henry@example.com',
    role: 'user',
    active: true,
    created_at: '2026-03-17T15:40:00Z',
  },
  {
    id: '9',
    name: 'Ivy Walker',
    email: 'ivy@example.com',
    role: 'viewer',
    active: true,
    created_at: '2026-03-25T10:05:00Z',
  },
  {
    id: '10',
    name: 'Jack Hall',
    email: 'jack@example.com',
    role: 'user',
    active: false,
    created_at: '2026-04-02T17:30:00Z',
  },
  {
    id: '11',
    name: 'Kate Young',
    email: 'kate@example.com',
    role: 'admin',
    active: true,
    created_at: '2026-04-10T09:15:00Z',
  },
  {
    id: '12',
    name: 'Leo King',
    email: 'leo@example.com',
    role: 'editor',
    active: true,
    created_at: '2026-04-18T12:50:00Z',
  },
];

export const usersStore: Map<string, User> = new Map(
  initialUsers.map((u) => [u.id, u]),
);

export function nextUserId(): string {
  return String(usersStore.size + 1);
}

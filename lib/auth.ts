import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth';

// Server-side auth utilities
export async function getServerAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
}

export async function requireRole(role: string) {
  const session = await requireAuth();
  if (!session.user?.roles?.includes(role)) {
    throw new Error(`Role '${role}' required`);
  }
  return session;
}
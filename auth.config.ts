import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

export const authConfig: NextAuthOptions = {
  useSecureCookies: process.env.NODE_ENV === 'production',
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id || '';
        token.username = (user as any).username || '';
        token.roles = (user as any).roles || ['subscriber'];
        token.accessToken = (user as any).token || '';
        token.displayName = (user as any).displayName || user.name || '';
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = (token.id as string) || '';
        session.user.username = (token.username as string) || '';
        session.user.roles = (token.roles as string[]) || ['subscriber'];
        session.user.accessToken = (token.accessToken as string) || '';
        session.user.displayName =
          (token.displayName as string) || session.user.name || '';
      }
      return session;
    },
  },
  providers: [], // Add your providers like Google, Credentials, etc.
};


import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

export interface WordPressUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
  token: string;
}

export const authOptions = {
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'WordPress',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Attempt login via JWT
          const tokenResponse = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/jwt-auth/v1/token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            }
          );

          if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('WordPress login failed:', {
              status: tokenResponse.status,
              statusText: tokenResponse.statusText,
              rawResponse: errorText,
            });
            return null;
          }

          const tokenData = await tokenResponse.json();

          // Fetch user info with token
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/users/me`,
            {
              headers: {
                Authorization: `Bearer ${tokenData.token}`,
              },
            }
          );

          if (!userResponse.ok) {
            const errorText = await userResponse.text();
            console.error('Failed to fetch user data:', {
              status: userResponse.status,
              statusText: userResponse.statusText,
              rawResponse: errorText,
              token: tokenData.token ? 'Present' : 'Missing',
            });
            return null;
          }

          const userData = await userResponse.json();

          return {
            id: userData.id.toString(),
            name: userData.name,
            email: userData.email,
            username: userData.slug,
            displayName: userData.name,
            roles: userData.roles || ['subscriber'],
            token: tokenData.token,
          };
        } catch (error) {
          console.error('Authentication error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            credentials: {
              username: credentials.username,
              passwordProvided: !!credentials.password,
            },
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};

export default NextAuth(authOptions);
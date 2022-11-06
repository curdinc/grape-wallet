import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

if (
  !process.env.GITHUB_ID ||
  !process.env.GITHUB_SECRET ||
  !process.env.GOOGLE_ID ||
  !process.env.GOOGLE_SECRET
) {
  throw new Error('Missing auth env vars');
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      // authorization: {
      //   params: {
      //     prompt: 'consent',
      //     access_type: 'offline',
      //     response_type: 'code',
      //   },
      // },
    }),
  ],
  pages: {
    signIn: '/auth/sign-in',
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
};

export default NextAuth(authOptions);

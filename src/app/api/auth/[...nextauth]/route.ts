import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              googleId: account.providerAccountId,
            });
          }
          
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return true; // Still allow sign in even if DB operation fails
        }
      }
      
      return true;
    },
    async session({ session }) {
      // Add user data from database to session
      if (session.user?.email) {
        try {
          await dbConnect();
          const userData = await User.findOne({ email: session.user.email });
          
          if (userData) {
            // Type assertion to avoid TypeScript errors
            session.user.id = userData._id.toString();
            session.user.mbtiResult = userData.mbtiResult;
            session.user.skillRatings = userData.skillRatings as Record<string, number>;
            session.user.savedCareers = userData.savedCareers as string[];
          }
        } catch (error) {
          console.error('Error fetching user data for session:', error);
        }
      }
      
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
});

export { handler as GET, handler as POST };
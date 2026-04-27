import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_ID = process.env.GOOGLE_ID!
const GOOGLE_SECRET = process.env.GOOGLE_SECRET!

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
  ],
  session:{
    strategy:"jwt"
  },
  callbacks:{
    async signIn({account,profile}) {
      if(!profile?.email){
        throw new Error("email not found")
      }
        console.log("callback",profile)
        
      return true;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

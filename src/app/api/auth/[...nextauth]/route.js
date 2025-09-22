import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/moingoDb"; // update path if different
import { use } from "react";
// import bcrypt from "bcryptjs"; if you use hashed passwords

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("Invoice");
        const collection = db.collection("User");

        // Find by email or phone
        const user = await collection.findOne({
          $or: [{ email: credentials.email }, { phone: credentials.email }],
        });

        if (!user) {
          throw new Error("No user found with this email/phone");
        }

        // If stored hashed password, use bcrypt.compare
        // const isValid = await bcrypt.compare(credentials.password, user.password);
        // if (!isValid) throw new Error("Invalid password");

        // If plain text (not recommended), compare directly:
        if (!(credentials.password == user.password)) {
          throw new Error("Invalid password");
        }

        // Return the object that represents the user (NextAuth will put this into jwt callback as `user`)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          birth_date: user.birth_date,
          address: user.address,
          phone: user.phone,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * jwt callback runs on every request. On sign-in, `user` is present.
     * - If `user` exists (first sign-in), attach fields from returned user.
     * - Else (subsequent calls), if token lacks id/phone/etc but has email (OAuth case),
     *   fetch DB user and attach fields to token.
     */
    async jwt({ token, user, account }) {
      // When user logs in (credentials or provider), NextAuth provides `user`
      
      if (user) {
        token.id = user.id ?? token.id;
        token.phone = user.phone ?? token.phone;
        token.birth_date = user.birth_date ?? token.birth_date;
        token.address = user.address ?? token.address;
        token.image = user.image ?? token.image;
        token.email = user.email ?? token.email;
        return token;
      }

      // For OAuth flows (or future requests) — if token doesn't have id but has email,
      // fetch DB user to populate missing fields (runs only when needed).
      if (!token.id && token.email) {
        try {
          const client = await clientPromise;
          const db = client.db("Invoice");
          const collection = db.collection("User");
          const dbUser = await collection.findOne({ email: token.email });

          if (dbUser) {
            token.id = dbUser._id.toString();
            token.phone = dbUser.phone;
            token.birth_date = dbUser.birth_date;
            token.address = dbUser.address;
            token.image = dbUser.image;
          }
        } catch (err) {
          console.error("JWT callback DB fetch error:", err);
        }
      }

      return token;
    },

    /**
     * signIn callback: create user for OAuth if not exist.
     * This does not need to populate the JWT — the jwt callback handles that.
     */
    async signIn({ user, account, profile }) {
      try {
        const client = await clientPromise;
        const db = client.db("Invoice");
        const collection = db.collection("User");

        const existingUser = await collection.findOne({ email: user.email });

        if (!existingUser) {
          // create minimal user from provider data; avoid plain default passwords in production
          await collection.insertOne({
            name: user.name || "",
            email: user.email,
            phone: user.phone || "",
            birth_date: user.birth_date || "",
            address: user.address || "",
            image: user.image || "",
            provider: account.provider,
            providerId: profile.id,
            password: null,
            // don't store insecure default password in prod; better set null or random string
          });
        }
        return true;
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }
    },

    /**
     * session callback: expose custom fields on session.user
     */
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.birth_date = token.birth_date;
        session.user.address = token.address;
        session.user.image = token.image;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };

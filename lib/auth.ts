import { betterAuth, APIError } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";
import * as schema from "./db/schema";
import { AUTHORIZED_EMAILS } from "./auth-whitelist";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!AUTHORIZED_EMAILS.includes(user.email)) {
            throw new APIError("UNAUTHORIZED", {
              message: "Email not authorized",
            });
          }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          // We need to check the user associated with this session
          const user = await db.query.user.findFirst({
            where: eq(schema.user.id, session.userId),
          });
          if (!user || !AUTHORIZED_EMAILS.includes(user.email)) {
            throw new APIError("UNAUTHORIZED", {
              message: "Email not authorized",
            });
          }
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    {
      id: "email-whitelist",
      hooks: {
        before: [
          {
            matcher: (context) => {
              return (
                context.path === "/sign-in/email" ||
                context.path === "/sign-up/email"
              );
            },
            handler: async (context) => {
              const body = context.body as { email?: string } | undefined;
              if (body?.email && !AUTHORIZED_EMAILS.includes(body.email)) {
                throw new APIError("UNAUTHORIZED", {
                  message: "Email not authorized",
                });
              }
            },
          },
        ],
      },
    },
  ],
});

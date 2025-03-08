import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      mbtiResult?: string;
      skillRatings?: Record<string, number>;
      savedCareers?: string[];
    } & DefaultSession["user"];
  }
}
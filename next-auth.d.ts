import { DefaultSession } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      guestId: number;
    } & DefaultSession["user"];
  }

  interface User {
    guestId: number;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    guestId: number;
  }
}

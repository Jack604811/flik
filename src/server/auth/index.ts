import { getServerSession, type DefaultSession } from "next-auth";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      subscriptionId: string | null;
      customerId: string;
      oneTimeProductId: string | null;
      country: string;
      // ...other properties
      // role: UserRole;
    };
  }

  interface User {
    email: string;
    name: string;
    subscriptionId: string | null;
    customerId: string;
    oneTimeProductId: string | null;
    country: string;
  }
}

//Single point of import for all auth related modules

import { providers } from "./providers";
import { events } from "./events";
import { callbacks } from "./callbacks";
import { pages } from "./pages";
import { authOptions } from "./options";


export const getCurrentUser = async () => {
  const userSession = await getServerSession(authOptions);

  return userSession?.user
}

export { providers, events, callbacks, pages };

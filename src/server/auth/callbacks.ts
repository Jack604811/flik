import type { Account, CallbacksOptions, Profile } from "next-auth";

export const callbacks:
  | Partial<CallbacksOptions<Profile, Account>>
  | undefined = {
  session: ({ session, user }) => ({
    ...session,
    user: {
      ...session.user,
      id: user.id,
      customerId: user.customerId,
      subscriptionId: user.subscriptionId,
      oneTimeProductId: user.oneTimeProductId,
    },
  }),
  async redirect({ url, baseUrl }) {
    // Allows relative callback URLs
    if (url.startsWith("/")) return `${baseUrl}${url}`
    // Allows callback URLs on the same origin
    else if (new URL(url).origin === baseUrl) return url
    return baseUrl
  }
};

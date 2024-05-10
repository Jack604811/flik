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
};

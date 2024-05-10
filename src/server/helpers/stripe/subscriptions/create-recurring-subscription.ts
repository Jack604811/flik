import { db } from "@/server/db";

interface CreateRecurringSubscriptionInput {
    userId: string;
    subscriptionId: string;

}

export async function createRecurringSubscription({ userId, subscriptionId }: CreateRecurringSubscriptionInput) {
    try {
        const user = await db.user.update({
            data: {
                subscriptionId
            },
            where: {
                id: userId
            }
        })
        return user;
    } catch (error) {
        console.error(error)
    }
}
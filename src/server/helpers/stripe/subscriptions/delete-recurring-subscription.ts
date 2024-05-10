import { db } from "@/server/db";

interface DeleteRecurringSubscriptionInput {
    customerId: string;

}

export async function deleteRecurringSubscription({ customerId }: DeleteRecurringSubscriptionInput) {
    try {
        const user = await db.user.update({
            data: {
                subscriptionId: null
            },
            where: {
                customerId: customerId
            }
        })
        return user;
    } catch (error) {
        console.error(error)
    }
}
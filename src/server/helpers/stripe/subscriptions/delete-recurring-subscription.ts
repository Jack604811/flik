import { db } from "@/server/db";

interface DeleteRecurringSubscriptionInput {
    customerId: string;

}

export async function deleteRecurringSubscription({ customerId }: DeleteRecurringSubscriptionInput) {
    try {
        const workspace = await db.workspace.update({
            data: {
                subscriptionId: null
            },
            where: {
                customerId: customerId
            }
        })
        return workspace;
    } catch (error) {
        console.error(error)
    }
}
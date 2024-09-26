import { db } from "@/server/db";

interface CreateRecurringSubscriptionInput {
    workspaceId: string;
    subscriptionId: string;

}

export async function createRecurringSubscription({ workspaceId, subscriptionId }: CreateRecurringSubscriptionInput) {
    try {
        const user = await db.workspace.update({
            data: {
                subscriptionId
            },
            where: {
                id: workspaceId
            }
        })
        return user;
    } catch (error) {
        console.error(error)
    }
}
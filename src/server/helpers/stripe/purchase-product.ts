import { db } from "@/server/db";

export async function purchaseProduct({ userId, productId }: { userId: string, productId: string }) {

    return db.user.update({
        where: {
            id: userId
        },
        data: {
            oneTimeProducts: {
                connect: {
                    stripeProductId: productId
                }
            }
        }
    })
}
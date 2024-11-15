//@ts-check
import { PrismaClient } from '@prisma/client';
import { handleWebhook } from './actions/webhook.action';

let prisma: PrismaClient;
declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}
export const db = prisma.$extends(
  {
    name: "webhook",
    query: {
      booking: {
        async create({args, model, operation, query}) {
          const booking = await query(args);
          // Send webhook
          handleWebhook("booking.created", booking.spot?.workspaceId!, null, booking);
          return booking;
        }
      },
      transaction: {
        async upsert({args, model, operation, query}) {
          let previous = null;
          if (!!args.where.id) {
            previous = await db.transaction.findUnique({ where: { id: args.where.id } });
          }
            const transaction = await query({
              ...args,
              include: {
              ...args.include,
              booking: {
                ...(typeof args.include?.booking === 'object' ? args.include.booking : {}),
                include: {
                ...(typeof args.include?.booking === 'object' ? args.include.booking.include : {}),
                spot: {
                  ...(typeof args.include?.booking === 'object' && typeof args.include.booking.include?.spot === 'object' ? args.include.booking.include.spot : {}),
                  ...(typeof args.include?.booking === 'object' && typeof args.include.booking.include?.spot === 'object' ? args.include.booking.include.spot : {}),
                  select: {
                  ...(typeof args.include?.booking === 'object' && typeof args.include.booking.include?.spot === 'object' ? args.include.booking.include.spot.select : {}),
                  workspaceId: true
                  }
                }
                }
              }
              }
            });
            const workspaceId = transaction.booking?.spot?.workspaceId!;
            delete transaction.booking;

            const type = !!args.where.id ? "transaction.updated" : "transaction.created";
            // Send webhook
            handleWebhook(type, workspaceId, previous, transaction);
            return transaction;
        }
      }
    }
  }
);
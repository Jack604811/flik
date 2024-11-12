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
          handleWebhook("booking.create", booking.spot?.workspaceId!, null, booking);
          return booking;
        }
      }
    }
  }
);
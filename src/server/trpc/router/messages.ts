import {
  limitedProtectedProcedure,
  protectedProcedure,
  router,
} from "../utils";
import { z } from "zod";

export default router({
  getMessages: protectedProcedure
    .input(
      z.object({
        channelId: z.string(),
      })
    )
    .query(async ({ ctx, input: { channelId } }) => {
      const messages = await ctx.prisma.message.findMany({
        select: {
          text: true,
          created: true,
          userId: true,
          user: { select: { name: true, image: true } },
        },
        where: { channelId },
        orderBy: { created: "desc" },
      });

      return messages;
    }),

  getAllMessages: protectedProcedure.query(async ({ ctx }) => {
    const messages = await ctx.prisma.message.findMany({
      select: {
        text: true,
        created: true,
        userId: true,
        channelId: true,
        user: { select: { name: true, image: true } },
      },
      orderBy: { created: "desc" },
    });

    return messages;
  }),

  createMessage: limitedProtectedProcedure
    .input(
      z.object({
        text: z.string(),
        userId: z.string(),
        channelId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.create({ data: input });

      return message;
    }),

  deleteAll: protectedProcedure.mutation(async ({ ctx }) => {
    const payloads = await Promise.allSettled([
      ctx.prisma.message.deleteMany(),
      // ctx.prisma.channel.deleteMany(),
      // ctx.prisma.server.deleteMany(),
    ]);

    return payloads;
  }),
});

import {
  limitedProtectedProcedure,
  protectedProcedure,
  router,
} from "../utils";
import { z } from "zod";

export default router({
  getMessages: protectedProcedure.query(async ({ ctx }) => {
    const messages = await ctx.prisma.message.findMany({
      orderBy: { created: "desc" },
    });

    return messages;
  }),

  getAccounts: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      const accounts = await ctx.prisma.account.findMany({
        where: { userId: id },
      });

      return accounts;
    }),

  createMessage: limitedProtectedProcedure
    .input(
      z.object({
        text: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.create({ data: input });

      return message;
    }),

  deleteAllMessages: protectedProcedure.mutation(async ({ ctx }) => {
    const payload = await ctx.prisma.message.deleteMany();

    return payload;
  }),
});

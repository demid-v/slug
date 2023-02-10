import { procedure, router } from "../utils";

export default router({
  getMessages: procedure.query(async ({ ctx }) => {
    const messages = await ctx.prisma.message.findMany();

    return messages;
  }),
});

import {
  limitedProtectedProcedure,
  protectedProcedure,
  router,
} from "../utils";
import { z } from "zod";

export default router({
  createServer: limitedProtectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const server = await ctx.prisma.server.create({ data: input });

      return server;
    }),

  getServers: protectedProcedure.query(async ({ ctx }) => {
    const servers = await ctx.prisma.server.findMany();

    return servers;
  }),

  getServer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      const server = await ctx.prisma.server.findFirstOrThrow({
        where: { id },
      });

      return server;
    }),
});

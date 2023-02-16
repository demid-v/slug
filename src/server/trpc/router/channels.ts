import {
  limitedProtectedProcedure,
  protectedProcedure,
  router,
} from "../utils";
import { z } from "zod";

export default router({
  createChannel: limitedProtectedProcedure
    .input(
      z.object({
        name: z.string(),
        serverId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.prisma.channel.create({ data: input });

      return channel;
    }),

  getChannels: protectedProcedure.query(async ({ ctx }) => {
    const channels = await ctx.prisma.channel.findMany();

    return channels;
  }),

  getChannelsForServer: protectedProcedure
    .input(
      z.object({
        serverId: z.string(),
      })
    )
    .query(async ({ ctx, input: { serverId } }) => {
      const channels = await ctx.prisma.channel.findMany({
        where: { serverId },
      });

      return channels;
    }),

  getChannel: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        serverId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input: { id, serverId } }) => {
      const channel = await ctx.prisma.channel.findFirstOrThrow({
        where: id ? { id } : { serverId },
      });

      return channel;
    }),
});

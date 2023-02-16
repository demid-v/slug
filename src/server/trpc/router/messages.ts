import {
  limitedProtectedProcedure,
  protectedProcedure,
  router,
} from "../utils";
import { z } from "zod";

export default router({
  getMessages: protectedProcedure.query(async ({ ctx }) => {
    const messages = await ctx.prisma.message.findMany({
      select: {
        text: true,
        created: true,
        userId: true,
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

import { z } from "zod";
import { type Voice } from "~/server/actions";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { getUserImagesForVoices } from "~/server/queries";

export const voicesRouter = createTRPCRouter({
  getUserImagesForVoices: protectedProcedure
    .input(z.custom<Voice[]>())
    .query(async ({ input: voices }) => await getUserImagesForVoices(voices)),

  getVoicesAndUserImages: protectedProcedure
    .input(z.object({ chatId: z.number(), cursor: z.number().optional() }))
    .query(async ({ input: { chatId, cursor } }) => {
      const voices = await db.query.voices.findMany({
        where: (voices, { and, eq, lt }) =>
          and(
            eq(voices.chatId, chatId),
            typeof cursor !== "undefined" ? lt(voices.id, cursor) : undefined,
          ),
        limit: 15,
        orderBy: (voices, { desc }) => [
          desc(voices.createdAt),
          desc(voices.id),
        ],
      });

      return await getUserImagesForVoices(voices);
    }),
});

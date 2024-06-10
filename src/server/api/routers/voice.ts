import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { getUserImagesForVoices } from "~/server/queries";

export const voiceRouter = createTRPCRouter({
  all: protectedProcedure
    .input(z.object({ chatId: z.number(), cursor: z.number().nullish() }))
    .query(async ({ input: { chatId, cursor } }) => {
      const voices = await db.query.voices.findMany({
        where: (voices, { and, eq, lt }) =>
          and(
            eq(voices.chatId, chatId),
            cursor != null ? lt(voices.id, cursor) : undefined,
          ),
        limit: 15,
        orderBy: (voices, { desc }) => [
          desc(voices.createdAt),
          desc(voices.id),
        ],
      });

      const voicesAndUserImages = await getUserImagesForVoices(voices);
      const nextCursor = voices.at(-1)?.id ?? 0;

      return { voices: voicesAndUserImages, nextCursor };
    }),
});

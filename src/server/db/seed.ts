import { utapi } from "../uploadthing";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { fakerEN } from "@faker-js/faker";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import { Blob } from "buffer";
import "dotenv/config";
import { getTableName, sql } from "drizzle-orm";
import ffmpeg from "fluent-ffmpeg";
import fs, { type Dirent } from "fs";
import path from "node:path";
import { type FileEsque } from "uploadthing/types";
import { db } from "~/server/db";
import { chats, usersToChats, voices } from "~/server/db/schema";
import { isPromiseFulfilledResult } from "~/utils";

ffmpeg.setFfprobePath(ffprobePath);

const deleteDataFromDb = async () => {
  await db.delete(chats).where(undefined);

  await db.execute(
    sql.raw(
      `
      ALTER SEQUENCE ${getTableName(chats)}_${chats.id.name}_seq RESTART WITH 1;
      ALTER SEQUENCE ${getTableName(voices)}_${voices.id.name}_seq RESTART WITH 1;
      `,
    ),
  );

  const utFileKeys = (await utapi.listFiles()).files.map((file) => file.key);
  await utapi.deleteFiles(utFileKeys);
};

const seedChats = async () => {
  const chatsData = [
    { name: "⛑氣象巴打" },
    {
      name: "Mika Paradise | Social 🔮 Gaming 👾 Chill 💬 Active ✨ Emotes & Emojis ⚡ VC & Nitro",
    },
    { name: "Spreen" },
    { name: "🎥 ᴍɪʟʟɪᴏɴ ᴍᴏᴠɪᴇꜱ | ᴍᴏᴠɪᴇ ʀᴇQᴜᴇꜱᴛɪɴɢ ɢʀᴏᴜᴘ 2024" },
    { name: "Заброшенный мир" },
    ...new Array(100).fill(0).map(() => ({
      name: fakerEN.lorem.words({ min: 1, max: 25 }).slice(0, 128),
    })),
  ];

  return (await db.insert(chats).values(chatsData).returning()).map(
    (chat) => chat.id,
  );
};

const randomUserId = fakerEN.helpers.arrayElement(
  (await clerkClient.users.getUserList()).data,
).id;

const uploadMockVoices = async () => {
  const getDurationFromPath = (mockVoice: Dirent) =>
    new Promise<number | undefined>((resolve, reject) => {
      ffmpeg.ffprobe(
        `${mockVoice.parentPath}/${mockVoice.name}`,
        (error, metadata) => {
          if (error) reject(error);

          resolve(metadata.format.duration);
        },
      );
    });

  const mockVoicesPath = path.join(process.cwd(), "public/mock-voices");

  const getMockVoiceData = async (mockVoice: Dirent) => {
    const mockVoiceBlob = new Blob([
      fs.readFileSync(`${mockVoice.parentPath}/${mockVoice.name}`),
    ]) as FileEsque;
    mockVoiceBlob.name = mockVoice.name;

    const url = (await utapi.uploadFiles(mockVoiceBlob)).data?.url;
    const duration = await getDurationFromPath(mockVoice);

    return {
      url,
      duration,
    };
  };

  const queries = fs
    .readdirSync(mockVoicesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map(getMockVoiceData);

  return (await Promise.allSettled(queries)).filter(isPromiseFulfilledResult);
};

const seedVoices = async (
  uploadedMockVoices: Awaited<ReturnType<typeof uploadMockVoices>>,
) => {
  const createInsertVoicesQueries = (
    chatId: number,
    numberOfVoices: number,
  ) => {
    const { url = "", duration = 0 } =
      fakerEN.helpers.arrayElement(uploadedMockVoices).value ?? {};

    return new Array(numberOfVoices).fill(0).map(() => ({
      url,
      duration,
      userId: randomUserId,
      chatId,
    }));
  };

  const values = [
    ...createInsertVoicesQueries(2, 1),
    ...createInsertVoicesQueries(3, 5),
    ...createInsertVoicesQueries(4, 15),
    ...createInsertVoicesQueries(5, 50),
  ];

  await db.insert(voices).values(values);
};

const seedUsersChatsSubscriptions = async (chatIds: number[]) => {
  const randomChatIds = fakerEN.helpers.arrayElements(chatIds, 30);

  const queries = randomChatIds.map((chatId) =>
    db.insert(usersToChats).values({ chatId, userId: randomUserId }),
  );

  await Promise.allSettled(queries);
};

const seed = async () => {
  console.log("Seeding database...");

  const chatIds = await seedChats();
  const uploadedMockVoices = await uploadMockVoices();

  await Promise.allSettled([
    seedVoices(uploadedMockVoices),
    seedUsersChatsSubscriptions(chatIds),
  ]);

  console.log("Seeding complete.");
};

await deleteDataFromDb();
await seed();

process.exit(0);

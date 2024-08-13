import { utapi } from "../uploadthing";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { faker } from "@faker-js/faker";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import { Blob } from "buffer";
import "dotenv/config";
import { getTableName, sql } from "drizzle-orm";
import ffmpeg from "fluent-ffmpeg";
import { type Dirent } from "fs";
import { readFile, readdir } from "fs/promises";
import path from "path";
import { type FileEsque } from "uploadthing/types";
import { db } from "~/server/db";
import { chats, usersToChats, voices } from "~/server/db/schema";

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
      name: faker.lorem.words({ min: 1, max: 25 }).slice(0, 128),
    })),
  ]
    .map((chat) => ({ ...chat, createdAt: faker.date.past({ years: 2 }) }))
    .sort(
      (firstChat, secondChat) =>
        firstChat.createdAt.getTime() - secondChat.createdAt.getTime(),
    );

  return (await db.insert(chats).values(chatsData).returning()).map(
    (chat) => chat.id,
  );
};

const randomUserId = faker.helpers.arrayElement(
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
      await readFile(`${mockVoice.parentPath}/${mockVoice.name}`),
    ]) as FileEsque;
    mockVoiceBlob.name = mockVoice.name;

    const url = (await utapi.uploadFiles(mockVoiceBlob)).data?.url;
    const duration = await getDurationFromPath(mockVoice);

    return {
      url,
      duration,
    };
  };

  const fileUploadRequests = (
    await readdir(mockVoicesPath, { withFileTypes: true })
  )
    .filter((dirent) => dirent.isFile())
    .map(getMockVoiceData);

  return (await Promise.allSettled(fileUploadRequests)).filter(
    (result) => result.status === "fulfilled",
  );
};

const seedVoices = async (
  uploadedMockVoices: Awaited<ReturnType<typeof uploadMockVoices>>,
) => {
  const createVoicesData = (chatId: number, numberOfVoices: number) =>
    new Array(numberOfVoices).fill(0).map(() => {
      const { url = "", duration = 0 } =
        faker.helpers.arrayElement(uploadedMockVoices).value ?? {};

      return {
        url,
        duration,
        userId: randomUserId,
        chatId,
        createdAt: faker.date.past({ years: 2 }),
      };
    });

  const voicesData = [
    ...createVoicesData(2, 1),
    ...createVoicesData(3, 5),
    ...createVoicesData(4, 15),
    ...createVoicesData(5, 50),
  ].sort(
    (firstVoice, secondVoice) =>
      firstVoice.createdAt.getTime() - secondVoice.createdAt.getTime(),
  );

  await db.insert(voices).values(voicesData);
};

const seedUsersChatsSubscriptions = async (chatIds: number[]) => {
  const chatIdsAndJoinAtDatetimes = new Array(30).fill(0).map(() => ({
    chatId: faker.helpers.arrayElement(chatIds),
    joinedAt: faker.date.past({ years: 1 }),
  }));

  const queries = chatIdsAndJoinAtDatetimes.map(({ chatId, joinedAt }) =>
    db.insert(usersToChats).values({ chatId, userId: randomUserId, joinedAt }),
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

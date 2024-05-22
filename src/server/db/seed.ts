import { utapi } from "../uploadthing";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import { Blob } from "buffer";
import "dotenv/config";
import { getTableName, sql } from "drizzle-orm";
import ffmpeg from "fluent-ffmpeg";
import fs, { type Dirent } from "fs";
import path from "node:path";
import { type FileEsque } from "uploadthing/types";
import { db } from "~/server/db";
import { chats, voices } from "~/server/db/schema";
import { isPromiseFulfilledResult } from "~/utils";

ffmpeg.setFfprobePath(ffprobePath);

const deleteDataFromDb = async () => {
  await db.delete(chats).where(undefined);

  await db.execute(
    sql.raw(
      `ALTER SEQUENCE ${getTableName(chats)}_${chats.id.name}_seq RESTART WITH 1`,
    ),
  );
  await db.execute(
    sql.raw(
      `ALTER SEQUENCE ${getTableName(voices)}_${voices.id.name}_seq RESTART WITH 1`,
    ),
  );

  const utFilesIds = (await utapi.listFiles()).files.map((file) => file.key);
  await utapi.deleteFiles(utFilesIds);
};

const seedChats = async () => {
  const data = [
    { name: "⛑氣象巴打" },
    {
      name: "Mika Paradise | Social 🔮 Gaming 👾 Chill 💬 Active ✨ Emotes & Emojis ⚡ VC & Nitro",
    },
    { name: "Spreen" },
    { name: "🎥 ᴍɪʟʟɪᴏɴ ᴍᴏᴠɪᴇꜱ | ᴍᴏᴠɪᴇ ʀᴇQᴜᴇꜱᴛɪɴɢ ɢʀᴏᴜᴘ 2024" },
    { name: "Заброшенный мир" },
  ];

  return (await db.insert(chats).values(data).returning()).map(
    (chat) => chat.id,
  );
};

const seedVoices = async (chatsIds: number[]) => {
  const getDurationFromPath = (file: Dirent) =>
    new Promise<{
      fileName: string;
      duration: number | undefined;
    }>((resolve, reject) => {
      ffmpeg.ffprobe(`${file.parentPath}/${file.name}`, (error, metadata) => {
        if (error) reject(error);

        resolve({
          fileName: file.name,
          duration: metadata.format.duration,
        });
      });
    });

  const getRandom = <T>(items: T[]) =>
    items.at(Math.floor(Math.random() * items.length));

  const mockVoicesPath = path.join(process.cwd(), "public/mock-voices");

  const files = fs
    .readdirSync(mockVoicesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isFile());

  const getFileData = async (file: Dirent) => {
    const fileBlob = new Blob([
      fs.readFileSync(`${file.parentPath}/${file.name}`),
    ]) as FileEsque;
    fileBlob.name = file.name;

    return {
      uploadedFileUrl: (await utapi.uploadFiles(fileBlob)).data?.url,
      duration: (await getDurationFromPath(file)).duration,
    };
  };

  const uploadedFilesData = (
    await Promise.allSettled(files.map(getFileData))
  ).filter(isPromiseFulfilledResult);

  const insertVoices = async (chatId?: number) => {
    const { uploadedFileUrl, duration } =
      getRandom(uploadedFilesData)?.value ?? {};

    const randomUser = getRandom(
      (await clerkClient.users.getUserList()).data,
    )?.id;

    const randomChatId = chatId ?? getRandom(chatsIds);

    await db.insert(voices).values({
      url: uploadedFileUrl ?? "",
      duration: duration ?? 0,
      userId: randomUser ?? "",
      chatId: randomChatId ?? 0,
    });
  };

  const generateVoiceInserts = (times: number, chatId: number) =>
    new Array(times).fill(0).map(() => insertVoices(chatId));

  const insertVoicesIntoChat: Promise<void>[] = [];

  insertVoicesIntoChat.push(...generateVoiceInserts(1, 2));
  insertVoicesIntoChat.push(...generateVoiceInserts(5, 3));
  insertVoicesIntoChat.push(...generateVoiceInserts(15, 4));
  insertVoicesIntoChat.push(...generateVoiceInserts(50, 5));

  await Promise.allSettled(insertVoicesIntoChat);
};

const seed = async () => {
  console.log("Seed started");

  const chatsIds = await seedChats();
  await seedVoices(chatsIds);

  console.log("Seed done");
};

await deleteDataFromDb();
await seed();

process.exit(0);

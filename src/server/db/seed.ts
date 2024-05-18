import { utapi } from "../uploadthing";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { faker } from "@faker-js/faker";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import { Blob } from "buffer";
import "dotenv/config";
import ffmpeg from "fluent-ffmpeg";
import fs, { type Dirent } from "fs";
import path from "node:path";
import { exit } from "process";
import { type FileEsque } from "uploadthing/types";
import { db } from "~/server/db";
import { chats, voices } from "~/server/db/schema";

ffmpeg.setFfprobePath(ffprobePath);

const deleteDataFromDb = async () => {
  await db.delete(chats).where(undefined);

  const utFilesIds = (await utapi.listFiles()).files.map((file) => file.key);
  await utapi.deleteFiles(utFilesIds);
};

const seedChats = async () => {
  const data = [];

  for (let i = 0; i < 5; i++) {
    data.push({
      name: faker.lorem.words({ min: 1, max: 30 }).slice(0, 128),
    });
  }

  return (await db.insert(chats).values(data).returning()).map(
    (chat) => chat.id,
  );
};

const seedVoices = async (chatsIds: number[]) => {
  const mockVoicesPath = path.join(process.cwd(), "public/mock-voices");

  const files = fs
    .readdirSync(mockVoicesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isFile());

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

  for (const file of files) {
    const fileBlob = new Blob([
      fs.readFileSync(`${file.parentPath}/${file.name}`),
    ]) as FileEsque;
    fileBlob.name = file.name;

    const uploadedFile = await utapi.uploadFiles(fileBlob);
    const duration = (await getDurationFromPath(file)).duration ?? 0;

    const getRandom = <Item>(items: Item[]) =>
      items.at(Math.floor(Math.random() * items.length));

    const randomUser = getRandom(
      (await clerkClient.users.getUserList()).data,
    )?.id;

    await db.insert(voices).values({
      url: uploadedFile.data?.url ?? "",
      duration,
      userId: randomUser ?? "",
      chatId: getRandom(chatsIds) ?? 0,
    });
  }
};

const seed = async () => {
  console.log("Seed start");

  const chatsIds = await seedChats();

  const voiceSeederPromises = new Array(3)
    .fill(0)
    .map(() => seedVoices(chatsIds));
  await Promise.allSettled(voiceSeederPromises);

  console.log("Seed done");
};

await deleteDataFromDb();
await seed();

exit(0);

import { SignedIn } from "@clerk/nextjs";
import { type User, clerkClient } from "@clerk/nextjs/server";
import { SlugUploadButton } from "~/components/upload-button";
import { db } from "~/server/db";

export default async function HomePage() {
  const voices = await db.query.voices.findMany();
  const users = await Promise.allSettled(voices.map((voice) => clerkClient.users.getUser(voice.userId)));
  
  const fulfilledUsers = users.filter((user) => user.status === "fulfilled") as PromiseFulfilledResult<User>[];
  const findUserImg = (userId: string) => fulfilledUsers.find((user) => user.value.id === userId)?.value.imageUrl
  
  return (
    <main>
      <SignedIn>
        <SlugUploadButton />
        {voices.map((voice) => (
          <div key={voice.id}>
            <img src={findUserImg(voice.userId)} className="w-8 h-8 rounded-full" />
            <audio src={voice.url} controls />
          </div>
        ))}
      </SignedIn>
    </main>
  );
}

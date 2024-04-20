import { SignedIn } from "@clerk/nextjs";
import { type User, clerkClient } from "@clerk/nextjs/server";
import { SlugUploadButton } from "~/components/upload-button";
import { db } from "~/server/db";

export default async function HomePage() {
  const voices = await db.query.voices.findMany({
    orderBy: (voices, { desc }) => [desc(voices.createdAt)],
  });
  const users = await Promise.allSettled(
    voices.map((voice) => clerkClient.users.getUser(voice.userId)),
  );

  const findUserImg = (userId: string) =>
    (
      users.find(
        (user) => user.status === "fulfilled" && user.value.id === userId,
      ) as PromiseFulfilledResult<User> | undefined
    )?.value.imageUrl;

  return (
    <main>
      <SignedIn>
        <SlugUploadButton />
        {voices.map((voice) => (
          <div key={voice.id}>
            <img
              src={findUserImg(voice.userId)}
              className="h-8 w-8 rounded-full"
              alt="Profile picture"
            />
            <p>{voice.createdAt.toLocaleTimeString()}</p>
            <audio src={voice.url} controls />
          </div>
        ))}
      </SignedIn>
    </main>
  );
}

import { SignedIn } from "@clerk/nextjs";
import { SlugUploadButton } from "~/components/upload-button";
import { db } from "~/server/db";

export default async function HomePage() {
  const voices = await db.query.voices.findMany();
  
  return (
    <main>
      <SignedIn>
        <SlugUploadButton />
        {voices.map((voice) => (
          <p key={voice.id}>
            {JSON.stringify(voice, null, 2)}
          </p>
        ))}
      </SignedIn>
    </main>
  );
}

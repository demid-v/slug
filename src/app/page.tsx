import { SignedIn } from "@clerk/nextjs";
import { SlugUploadButton } from "~/components/upload-button";
import { db } from "~/server/db";

export default async function HomePage() {
  const voices = await db.query.voices.findMany();
  
  return (
    <main>
      <SignedIn>
        <SlugUploadButton />
        {voices.map((voice) => JSON.stringify(voice, null, 2))}
        <br />
      </SignedIn>
    </main>
  );
}

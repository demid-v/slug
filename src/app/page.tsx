import { SignedIn } from "@clerk/nextjs";
import { RecordButton } from "~/components/upload-button";
import { Voice } from "~/components/voice";
import { getVoices } from "~/server/db/actions";

export default async function HomePage() {
  const voices = await getVoices();

  return (
    <main>
      <SignedIn>
        <RecordButton />
        {voices.map(([voiceId, { voice, userImg }]) => (
          <Voice
            key={voiceId}
            userImg={userImg}
            createdAt={voice.createdAt}
            url={voice.url}
          />
        ))}
      </SignedIn>
    </main>
  );
}

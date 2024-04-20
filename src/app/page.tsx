import { SignedIn } from "@clerk/nextjs";
import { RecordButton } from "~/components/upload-button";
import { Voice } from "~/components/voice";
import { getVoices } from "~/server/db/actions";

export default async function HomePage() {
  const voices = await getVoices();

  return (
    <main className="flex justify-center">
      <div className="flex w-fit flex-col gap-10">
        <SignedIn>
          <RecordButton />
          <div className="flex flex-col gap-5">
            {voices.map(([voiceId, { voice, userImg }]) => (
              <Voice
                key={voiceId}
                userImg={userImg}
                createdAt={voice.createdAt}
                url={voice.url}
              />
            ))}
          </div>
        </SignedIn>
      </div>
    </main>
  );
}

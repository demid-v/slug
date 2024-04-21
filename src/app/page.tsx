import { SignedIn } from "@clerk/nextjs";
import { RecordButton } from "~/components/upload-button";
import { Voice } from "~/components/voice";
import { getVoices } from "~/server/db/actions";

export default async function HomePage() {
  const voices = await getVoices();

  return (
    <main className="flex justify-center pt-7">
      <div className="flex w-80 flex-col gap-8">
        <SignedIn>
          <div className="flex h-96 flex-col-reverse gap-5 overflow-y-auto border px-4 py-2">
            {voices.map(([voiceId, { voice, userImg }]) => (
              <Voice
                key={voiceId}
                userImg={userImg}
                createdAt={voice.createdAt}
                url={voice.url}
              />
            ))}
          </div>
          <RecordButton />
        </SignedIn>
      </div>
    </main>
  );
}

import { SignedIn } from "@clerk/nextjs";
import { Recorder } from "~/components/recorder";
import { Voice } from "~/components/voice";
import { getVoices } from "~/server/actions";

export default async function HomePage() {
  const voices = await getVoices();

  return (
    <main className="flex justify-center pb-16 pt-7">
      <div className="flex w-96 flex-col gap-8">
        <SignedIn>
          <div className="flex h-full flex-col-reverse gap-5 overflow-y-auto border px-4 py-2">
            {voices.map(([voiceId, { voice, userImg }]) => (
              <Voice
                key={voiceId}
                userImg={userImg}
                createdAt={voice.createdAt}
                url={voice.url}
              />
            ))}
          </div>
          <Recorder />
        </SignedIn>
      </div>
    </main>
  );
}

import { Recorder } from "~/components/recorder";
import { Voice } from "~/components/voice";
import { getVoices } from "~/server/actions";

export default async function Chat() {
  const voices = await getVoices();

  return (
    <div className="flex h-full w-96 flex-col gap-8">
      <div className="flex h-full flex-col-reverse gap-3 overflow-y-auto border px-4 py-2">
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
    </div>
  );
}

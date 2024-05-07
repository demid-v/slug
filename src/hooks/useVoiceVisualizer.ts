import { useRef, useState, useEffect } from "react";

const useVoiceVisualizer = (url: string) => {
  const isFetchingVoiceBlob = useRef(false);
  const [voiceBlob, setVoiceBlob] = useState<Blob>();

  const voiceVisualizer = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isFetchingVoiceBlob.current) return;

    isFetchingVoiceBlob.current = true;

    fetch(url)
      .then((res) => {
        res
          .blob()
          .then((blob) => {
            setVoiceBlob(blob);
          })
          .catch(console.error);
      })
      .catch(console.error)
      .finally(() => {
        isFetchingVoiceBlob.current = false;
      });
  }, [url]);

  return { voiceBlob, voiceVisualizer };
};

export default useVoiceVisualizer;

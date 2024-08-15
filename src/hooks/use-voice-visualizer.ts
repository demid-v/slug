import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import wretch from "wretch";

const useVoiceVisualizer = (url: string) => {
  const voiceVisualizer = useRef<HTMLCanvasElement>(null);

  const { data: voiceBlob } = useQuery({
    queryKey: [url],
    queryFn: () => wretch().get(url).blob(),
  });

  return { voiceVisualizer, voiceBlob };
};

export default useVoiceVisualizer;

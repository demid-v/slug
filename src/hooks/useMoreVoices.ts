import { useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  getVoicesAndUserImages,
  type VoicesAndUserImages,
} from "~/server/actions";
import { type SetState } from "~/utils/setStateType";

export const useMoreVoices = (
  numberOfVoices: number,
  cursor: number | undefined,
  chatId: number,
  setVoices: SetState<VoicesAndUserImages>,
) => {
  const voicesCursor = useRef(cursor);
  const isFetchingVoices = useRef(false);
  const isAllFetched = useRef(numberOfVoices < 15);

  const { ref: voiceRef, inView } = useInView();

  useEffect(() => {
    if (!inView || isFetchingVoices.current || isAllFetched.current) return;

    const getMoreVoices = async () => {
      try {
        const voices = await getVoicesAndUserImages(
          chatId,
          voicesCursor.current,
        );
        if (voices.length < 15) isAllFetched.current = true;

        setVoices((currentVoices) => [...currentVoices, ...voices]);
        voicesCursor.current = voices.at(-1)?.id;
      } catch (error) {
        console.error(error);
      }

      isFetchingVoices.current = false;
    };

    isFetchingVoices.current = true;

    void getMoreVoices();
  }, [inView, chatId, setVoices]);

  return { voiceRef };
};

import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "~/trpc/react";

const useInfiniteVoices = (chatId: number) => {
  const {
    data: voicesData,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = api.voice.all.useInfiniteQuery(
    { chatId },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  );

  const voices = useMemo(
    () => voicesData?.pages.flatMap((page) => page.voices) ?? [],
    [voicesData?.pages],
  );

  const { ref: voiceRef } = useInView({
    triggerOnce: true,
    onChange(inView) {
      if (!inView || isFetching || !hasNextPage) return;
      void fetchNextPage();
    },
  });

  return { voices, voiceRef };
};

export default useInfiniteVoices;

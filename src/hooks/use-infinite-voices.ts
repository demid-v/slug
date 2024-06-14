import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "~/trpc/react";

const useInfiniteVoices = (chatId: number) => {
  const { ref: voiceRef, inView } = useInView();

  const {
    data: voicesData,
    fetchNextPage,
    isLoading,
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

  useEffect(() => {
    if (!inView || !isLoading || !isFetching || !hasNextPage) return;

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView, isFetching, isLoading]);

  return { voices, voiceRef };
};

export default useInfiniteVoices;

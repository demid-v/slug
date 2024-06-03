import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "~/trpc/react";
import { type VoicesAndUserImages } from "~/trpc/types";

const useInfiniteVoices = (
  chatId: number,
  initialVoices: VoicesAndUserImages,
) => {
  const { ref: voiceRef, inView } = useInView();

  const { data: voicesData, fetchNextPage } =
    api.voices.voicesAndUserImages.useInfiniteQuery(
      { chatId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        initialData: { pages: [initialVoices], pageParams: [] },
      },
    );

  const voices = voicesData?.pages.flatMap((page) => page.voices) ?? [];

  const lastPageLength = voicesData?.pages.at(-1)?.voices?.length;
  const isAllFetched =
    typeof lastPageLength !== "undefined" && lastPageLength < 15 ? true : false;

  useEffect(() => {
    if (!inView || isAllFetched) return;

    void fetchNextPage();
  }, [fetchNextPage, inView, isAllFetched]);

  return { voices, voiceRef };
};

export default useInfiniteVoices;

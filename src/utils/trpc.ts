import { QueryClient } from "@tanstack/solid-query";
import type { IAppRouter } from "~/server/trpc/router/_app";
import { createTRPCSolidStart } from "solid-trpc";
import { httpBatchLink } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return "https://" + process.env.VERCEL_URL;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCSolidStart<IAppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
});

export const queryClient = new QueryClient();

export type RouterInputs = inferRouterInputs<IAppRouter>;
export type RouterOutputs = inferRouterOutputs<IAppRouter>;

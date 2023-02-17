// @refresh reload
import "./root.css";
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
  Link,
} from "solid-start";
import { trpc, queryClient } from "~/utils/trpc";
import { SessionProvider } from "./contexts/session";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Slug</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="theme-color" content="#026d56" />
        <Meta name="description" content="Chat app" />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        <SessionProvider>
          <trpc.Provider queryClient={queryClient}>
            <Suspense>
              <ErrorBoundary>
                <Routes>
                  <FileRoutes />
                </Routes>
              </ErrorBoundary>
            </Suspense>
          </trpc.Provider>
        </SessionProvider>
        <Scripts />
      </Body>
    </Html>
  );
}

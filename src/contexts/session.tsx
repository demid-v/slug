import type { Session } from "@auth/core/types";
import { getSession } from "@auth/solid-start";
import {
  createContext,
  useContext,
  type Resource,
  type JSXElement,
} from "solid-js";
import { createServerData$ } from "solid-start/server";
import { authOpts } from "~/routes/api/auth/[...solidauth]";

const SessionContext = createContext<Resource<Session | null | undefined>>();

export function SessionProvider(props: { children: JSXElement }) {
  const session = createServerData$(
    async (_, event) => await getSession(event.request, authOpts)
  );

  return (
    <SessionContext.Provider value={session}>
      {props.children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

import type { Session } from "@auth/core/types";
import {
  createContext,
  useContext,
  type Resource,
  type JSXElement,
} from "solid-js";

const SessionContext = createContext<Resource<Session | null | undefined>>();

export function SessionProvider(props: {
  children: JSXElement;
  session: Resource<Session | null | undefined>;
}) {
  return (
    <SessionContext.Provider value={props.session}>
      {props.children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

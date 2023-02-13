import { getSession } from "@auth/solid-start";
import { type VoidComponent } from "solid-js";
import { createServerData$ } from "solid-start/server";
import Auth from "~/components/Auth";
import Chat from "~/components/Chat";
import { authOpts } from "./api/auth/[...solidauth]";

const Home: VoidComponent = () => {
  const sessionData = createServerData$(
    async (_, event) => await getSession(event.request, authOpts)
  );

  return <>{sessionData() ? <Chat sessionData={sessionData} /> : <Auth />}</>;
};

export default Home;

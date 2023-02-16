import type { VoidComponent } from "solid-js";
import Auth from "~/components/Auth";
import Catalog from "~/components/Catalog";
import { useSession } from "~/session-context";

const Home: VoidComponent = () => {
  const session = useSession();

  return <>{session?.() ? <Catalog /> : <Auth />}</>;
};

export default Home;

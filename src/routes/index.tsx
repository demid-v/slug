import type { VoidComponent } from "solid-js";
import Auth from "~/components/Auth";
import Catalog from "~/components/Catalog";
import Header from "~/components/Header";
import { useSession } from "~/contexts/session";

const Home: VoidComponent = () => (
  <>
    {useSession()?.() ? (
      <>
        <Header />
        <Catalog />
      </>
    ) : (
      <Auth />
    )}
  </>
);

export default Home;

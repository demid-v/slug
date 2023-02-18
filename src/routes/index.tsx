import type { VoidComponent } from "solid-js";
import Auth from "~/components/Auth";
import Catalog from "~/components/Catalog";
import Header from "~/components/Header";
import { useSession } from "~/contexts/session";

const Home: VoidComponent = () => {
  const session = useSession();

  return (
    <>
      {session?.() ? (
        <>
          <Header />
          <Catalog />
        </>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default Home;

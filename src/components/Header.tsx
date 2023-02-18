import { signOut } from "@auth/solid-start/client";
import type { VoidComponent } from "solid-js";

const Header: VoidComponent = () => (
  <header class="flex justify-end px-10 py-2">
    <button class="text-black hover:underline" onClick={() => void signOut()}>
      Sign out
    </button>
  </header>
);

export default Header;

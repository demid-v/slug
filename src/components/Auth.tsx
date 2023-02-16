import { signIn } from "@auth/solid-start/client";
import type { VoidComponent } from "solid-js";

const Auth: VoidComponent = () => {
  return (
    <div class="mt-24 flex flex-col items-center">
      <h1 class="text-4xl font-semibold">Sign in Slug</h1>
      <img src="/assets/logos/logo256.png" alt="Slug logo" class="mb-5" />
      <button
        class="border-2 border-black px-7 py-1 font-medium no-underline"
        onClick={() => void signIn("discord")}
      >
        Discord
      </button>
    </div>
  );
};

export default Auth;

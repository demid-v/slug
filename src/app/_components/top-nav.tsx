import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { SlugIcon } from "~/components/slug-icon";

export const TopNav = () => {
  return (
    <nav className="flex h-14 items-center justify-between px-4">
      <div className="flex items-center gap-3 font-bold">
        <SlugIcon />
        <span className="cursor-default">Slug</span>
      </div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
};

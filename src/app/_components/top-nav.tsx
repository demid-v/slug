import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SlugIcon } from "~/components/slug-icon";

export const TopNav = () => {
  return (
    <nav className="flex h-14 items-center justify-between px-4">
      <Link href="/" className="flex items-center gap-3 font-bold">
        <SlugIcon width={32} height={32} />
        <span>Slug</span>
      </Link>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
};

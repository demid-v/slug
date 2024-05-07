import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import SlugIcon from "~/components/slug-icon";

const TopNav = () => {
  return (
    <nav className="flex items-center justify-between px-5 py-3">
      <Link href="/" className="flex items-center gap-3 font-bold">
        <SlugIcon width={32} height={32} />
        <span>Slug</span>
      </Link>
      <SignedOut>
        <SignInButton>
          <button className="font-medium">Sign in</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  );
};

export default TopNav;

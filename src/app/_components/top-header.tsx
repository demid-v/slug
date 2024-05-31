import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Navigation from "~/components/navigation";
import SlugIcon from "~/components/slug-icon";

const TopHeader = () => {
  return (
    <header className="flex items-center justify-between px-5 py-3">
      <div className="flex gap-16">
        <Link href="/" className="flex items-center gap-3 font-bold">
          <SlugIcon width={32} height={32} />
          <span>Slug</span>
        </Link>
        <Navigation />
      </div>
      <SignedOut>
        <SignInButton>
          <button className="font-medium">Sign in</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default TopHeader;

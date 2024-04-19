import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const TopNav = () => <nav>
	<SignedOut>
		<SignInButton />
	</SignedOut>
	<SignedIn>
		<UserButton />
	</SignedIn>
</nav>;

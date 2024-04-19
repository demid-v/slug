import { SignedIn } from "@clerk/nextjs";
import { SlugUploadButton } from "~/components/upload-button";

export default function HomePage() {
  return (
    <main>
      <SignedIn>
        <SlugUploadButton />
      </SignedIn>
    </main>
  );
}

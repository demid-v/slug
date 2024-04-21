import Link from "next/link";
import { SlugIcon } from "~/components/slug-icon";

export default async function HomePage() {
  return (
    <>
      <SlugIcon width={512} height={512} />
      <h1 className="text-5xl font-semibold">
        Welcome to{" "}
        <Link href="/chat" className="underline">
          Slug
        </Link>
      </h1>
    </>
  );
}

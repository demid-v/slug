import Link from "next/link";
import { SlugIcon } from "~/components/slug-icon";

export default async function HomePage() {
  return (
    <>
      <SlugIcon
        width="100%"
        height="100%"
        className="max-h-[450px] max-w-[450px]"
      />
      <h1 className="text-center text-6xl">
        <span className="font-semibold">Welcome to </span>
        <Link href="/chat" className="font-bold">
          Slug
        </Link>
      </h1>
    </>
  );
}

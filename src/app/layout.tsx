import { TopNav } from "./_components/top-nav";
import { ClerkProvider } from "@clerk/nextjs";
import "@uploadthing/react/styles.css";
import { Inter } from "next/font/google";
import { type ReactNode } from "react";
import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Slug",
  description: "Voice chat app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`font-sans ${inter.variable} grid h-svh grid-rows-[auto_1fr]`}
        >
          <TopNav />
          <main className="mx-auto flex min-h-0 flex-col items-center pb-16 pt-7">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

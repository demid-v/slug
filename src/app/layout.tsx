import TopHeader from "./_components/top-header";
import { ClerkProvider } from "@clerk/nextjs";
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

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} grid h-svh grid-rows-[auto_1fr]`}
      >
        <ClerkProvider>
          <TopHeader />
          <main className="container min-h-0 pb-16 pt-7">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
};

export default RootLayout;

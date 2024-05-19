import { type ReactNode } from "react";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex h-full justify-center">{children}</div>;
};

export default ChatLayout;

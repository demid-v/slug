import { type ReactNode } from "react";
import MyChats from "~/app/_components/my-chats";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-full justify-between">
      <MyChats className="min-w-96" />

      <div className="flex h-full w-full justify-center">{children}</div>
    </div>
  );
};

export default ChatLayout;

import { type ReactNode } from "react";
import MyChats from "~/app/_components/my-chats";
import Sidebar from "~/components/sidebar";

const ChatLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-full justify-between">
      <Sidebar>
        <MyChats />
      </Sidebar>

      <div className="container flex h-full w-full justify-center">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;

import type { Component } from "solid-js";
import { Outlet } from "solid-start";
import Header from "~/components/Header";

const ChatLayout: Component = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default ChatLayout;

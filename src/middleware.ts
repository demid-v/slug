import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isChatsRoute = createRouteMatcher(["/(chats|my-chats)(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (isChatsRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api(.*)"],
};

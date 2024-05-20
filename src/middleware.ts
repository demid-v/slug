import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isChatsRoute = createRouteMatcher(["/chats(.*)"]);
const isMyChatsRoute = createRouteMatcher(["/my-chats"]);

export default clerkMiddleware((auth, request) => {
  if (isChatsRoute(request) || isMyChatsRoute(request)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api(.*)"],
};

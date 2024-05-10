import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isChatRoute = createRouteMatcher(["/chats/(.*)"]);
const isMyChatsRoute = createRouteMatcher(["/my-chats"]);

export default clerkMiddleware((auth, request) => {
  if (isChatRoute(request) || isMyChatsRoute(request)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/api(.*)"],
};

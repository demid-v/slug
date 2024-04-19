import { clerkMiddleware } from '@clerk/nextjs/server';
 
export default clerkMiddleware(() => {
  0;
});
 
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/api(.*)'],
};

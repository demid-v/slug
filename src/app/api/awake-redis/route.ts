import { env } from "~/env";
import { ratelimitChats } from "~/server/ratelimit";

export const GET = async (request: Request) => {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    await ratelimitChats.limit("awake redis");
    return Response.json({ success: true });
  } catch (error) {
    return new Response("Failed to limit", {
      status: 500,
    });
  }
};

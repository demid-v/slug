import { router } from "../utils";
import servers from "./servers";
import channels from "./channels";
import messages from "./messages";

export const appRouter = router({
  servers,
  channels,
  messages,
});

export type IAppRouter = typeof appRouter;

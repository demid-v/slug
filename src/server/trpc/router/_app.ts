import { router } from "../utils";
import messages from "./messages";

export const appRouter = router({
  messages,
});

export type IAppRouter = typeof appRouter;

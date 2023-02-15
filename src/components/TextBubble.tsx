import type { Session } from "@auth/core/types";
import type { Resource } from "solid-js";
import type { ClientMessage } from "~/utils/types";

export default function TextBubble(props: {
  message: ClientMessage;
  sessionData: Resource<Session | null | undefined>;
}) {
  return (
    <div class="flex items-center gap-1">
      <img
        src={props.message.user?.image ?? ""}
        alt="User's pic"
        class="w-5 rounded-full"
      />
      <div class="w-fit max-w-full rounded-full border border-black px-2.5">
        {props.message.text}
      </div>
    </div>
  );
}

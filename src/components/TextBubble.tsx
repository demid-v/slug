import type { Session } from "@auth/core/types";
import type { Resource } from "solid-js";
import type { ClientMessage } from "~/utils/types";

export default function TextBubble(props: {
  message: ClientMessage;
  sessionData: Resource<Session | null | undefined>;
}) {
  return (
    <div
      class={
        "mt-1 w-fit max-w-full rounded-full border border-black px-2.5" +
        (props.message.userId !== props.sessionData()?.user?.id
          ? " self-end"
          : "")
      }
    >
      {props.message.text}
    </div>
  );
}

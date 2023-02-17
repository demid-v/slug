import type { ClientMessage } from "~/utils/types";

export default function TextBubble(props: { message: ClientMessage }) {
  return (
    <div class="flex items-end gap-1">
      <img
        src={props.message.user.image ?? ""}
        alt={props.message.user.name + " profile picture"}
        class="mb-0.5 w-5 rounded-full"
      />
      <div class="w-fit max-w-full rounded-3xl border border-black px-2.5">
        {props.message.text}
      </div>
    </div>
  );
}

export default function TextBubble(props: { message: string }) {
  return (
    <div class="mt-1 w-fit max-w-full rounded-full border border-black px-2.5">
      {props.message}
    </div>
  );
}

import type { VoidComponent } from "solid-js";
import { Navigate, useParams } from "solid-start";
import { trpc } from "~/utils/trpc";

const Chat: VoidComponent = () => {
  const params = useParams();

  const channel = trpc.messages.getChannel.useQuery(() => ({
    serverId: params.serverId,
  }));

  return (
    <>
      {channel.data?.id && (
        <Navigate href={`/${params.serverId}/${channel.data?.id}`} />
      )}
    </>
  );
};

export default Chat;

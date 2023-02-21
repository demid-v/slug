import type { VoidComponent } from "solid-js";
import { Navigate, useNavigate, useParams } from "solid-start";
import { useSession } from "~/contexts/session";
import { trpc } from "~/utils/trpc";

const Chat: VoidComponent = () => {
  if (useSession()?.() === null) {
    useNavigate()("/", { replace: true });
  }

  const { serverId } = useParams();

  const channel = trpc.channels.getChannel.useQuery(() => ({
    serverId,
  }));

  return (
    <>
      {channel.data?.id && (
        <Navigate href={`/chat/${serverId}/${channel.data?.id}`} />
      )}
    </>
  );
};

export default Chat;

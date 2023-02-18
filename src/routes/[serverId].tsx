import type { VoidComponent } from "solid-js";
import { Navigate, useNavigate, useParams } from "solid-start";
import { useSession } from "~/contexts/session";
import { trpc } from "~/utils/trpc";

const Chat: VoidComponent = () => {
  const params = useParams();

  if (useSession()?.() === null) {
    useNavigate()("/", { replace: true });
  }

  const channel = trpc.channels.getChannel.useQuery(() => ({
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

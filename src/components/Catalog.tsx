import { createEffect, createSignal, For, type VoidComponent } from "solid-js";
import { A } from "solid-start";
import { trpc } from "~/utils/trpc";
import type { Servers } from "~/utils/types";

const Catalog: VoidComponent = () => {
  const serversRes = trpc.servers.getServers.useQuery();

  const [servers, setServers] = createSignal<Servers | undefined>(
    serversRes?.data
  );

  createEffect(() => {
    setServers(serversRes?.data);
  }, serversRes?.data);

  return (
    <div class="mt-24 flex flex-col items-center">
      <h1 class="text-4xl font-semibold">Slug servers</h1>
      <ul class="mt-10">
        <For each={servers()}>
          {(server) => (
            <li>
              <A href={"/chat/" + server.id}>{server.name}</A>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default Catalog;

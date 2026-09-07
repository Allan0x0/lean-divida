import { trpc } from "../trpc";

export function Home() {
  const ping = trpc.health.ping.useQuery();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">lean-divida</h1>
      {ping.isPending && <p className="text-gray-500">pinging backend…</p>}
      {ping.error && <p className="text-red-600">error: {ping.error.message}</p>}
      {ping.data && (
        <p className="rounded bg-green-50 p-3 text-green-800">
          ok: {String(ping.data.ok)} · {ping.data.time.toLocaleString()}
        </p>
      )}
    </div>
  );
}

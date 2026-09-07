import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { BrowserRouter } from "react-router-dom";
import superjson from "superjson";
import { trpc } from "./trpc";
import { App } from "./App";
import "./index.css";
import { getToken, setToken } from "./token";

function Root() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      mutations: {
        onError: (err) => {
          if (err instanceof TRPCClientError && err.data?.code === "UNAUTHORIZED") {
            setToken(undefined);
          }
        }
      }
    }
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/trpc",
          transformer: superjson,
          headers: () => {
            const token = getToken();
            return token ? { Authorization: `Bearer ${token}` } : {};
          }
        })
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

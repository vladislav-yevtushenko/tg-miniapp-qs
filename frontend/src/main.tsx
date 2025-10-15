import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/index.css";
import { Provider } from "components/ui/provider";
import { TelegramProvider } from "providers/TelegramProvider";
import App from "App";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <Provider>
          <App />
        </Provider>
      </TelegramProvider>
    </QueryClientProvider>
  </StrictMode>,
);

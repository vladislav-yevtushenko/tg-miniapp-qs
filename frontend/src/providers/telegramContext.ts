import { createContext, useContext } from "react";

import type { TelegramUser } from "@/types/user";

export type TelegramContextValue = {
  user: TelegramUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error?: string;
};

export const TelegramContext = createContext<TelegramContextValue | null>(null);

export const useTelegramContext = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error("useTelegramContext must be used within TelegramProvider");
  }

  return context;
};

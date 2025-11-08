import { useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { initTelegram, getTelegramUser } from "services/telegram";
import { type TelegramContextValue, TelegramContext } from "./telegramContext";

export const TelegramProvider = ({ children }: PropsWithChildren) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initTelegram();
    setIsInitialized(true);
  }, []);

  const value = useMemo<TelegramContextValue>(
    () => ({
      user: getTelegramUser(),
      isLoading: !isInitialized,
      isAuthenticated: Boolean(getTelegramUser()),
      error: undefined,
    }),
    [isInitialized],
  );

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};

import { useEffect, useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/services/apiClient'
import { getInitData, getTelegramUser, initTelegram } from '@/services/telegram'
import { TelegramContext } from '@/providers/telegramContext'
import type { TelegramContextValue } from '@/providers/telegramContext'
import type { TelegramUser } from '@/types/user'

const fetchTelegramProfile = async (): Promise<TelegramUser> => {
  const initData = getInitData()
  if (!initData) {
    throw new Error('Missing Telegram init data')
  }

  const { data } = await apiClient.post('/telegram/auth', { init_data: initData })
  return data.user
}

export const TelegramProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    initTelegram()
  }, [])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['telegram', 'user'],
    queryFn: fetchTelegramProfile,
    enabled: Boolean(getTelegramUser()),
    staleTime: 5 * 60 * 1000,
  })

  const value = useMemo<TelegramContextValue>(
    () => ({
      user: data ?? getTelegramUser(),
      isLoading,
      isAuthenticated: Boolean(data),
      error: isError ? (error instanceof Error ? error.message : 'Failed to load Telegram user') : undefined,
    }),
    [data, error, isError, isLoading],
  )

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>
}

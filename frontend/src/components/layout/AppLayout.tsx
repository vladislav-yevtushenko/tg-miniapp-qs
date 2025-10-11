import type { PropsWithChildren } from 'react'

import { env } from '@/config/env'
import { useTelegramContext } from '@/providers/telegramContext'

export const AppLayout = ({ children }: PropsWithChildren) => {
  const { user } = useTelegramContext()

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div>
          <h1>{env.appName}</h1>
          <p className="app-shell__subtitle">Find and sell items with your classmates</p>
        </div>
        {user && (
          <div className="app-shell__profile">
            {user.photo_url && <img src={user.photo_url} alt={user.first_name} />}
            <div>
              <span>{user.first_name}</span>
              {user.username && <small>@{user.username}</small>}
            </div>
          </div>
        )}
      </header>
      <main className="app-shell__content">{children}</main>
    </div>
  )
}

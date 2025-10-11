import WebApp from '@twa-dev/sdk'

const telegram = WebApp

export const initTelegram = () => {
  telegram.ready()
  telegram.expand()
}

export const getTelegramUser = () => telegram.initDataUnsafe?.user ?? null

export const getInitData = () => telegram.initData ?? ''

export const telegramTheme = () => telegram.colorScheme

export { telegram }

const ensureEnv = (value: string | undefined, key: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const env = {
  appName: ensureEnv(import.meta.env.VITE_APP_NAME, "VITE_APP_NAME"),
  apiBaseUrl: ensureEnv(import.meta.env.VITE_APP_API_URL, "VITE_APP_API_URL"),
};

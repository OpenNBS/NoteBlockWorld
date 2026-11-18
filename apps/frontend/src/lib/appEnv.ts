export const APP_ENVS = [
  'local',
  'development',
  'staging',
  'production',
] as const;

export type AppEnv = (typeof APP_ENVS)[number];

function parseAppEnv(value: string | undefined): AppEnv {
  if (value && APP_ENVS.includes(value as AppEnv)) {
    return value as AppEnv;
  }

  return 'local';
}

/** Deployment environment for app behavior (not Node.js build optimizations). */
export function getAppEnv(): AppEnv {
  return parseAppEnv(process.env.APP_ENV ?? process.env.NEXT_PUBLIC_APP_ENV);
}

export function isProductionAppEnv(): boolean {
  return getAppEnv() === 'production';
}

export function isLocalAppEnv(): boolean {
  return getAppEnv() === 'local';
}

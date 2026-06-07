export const isDev = process.env.NODE_ENV !== 'production';

function timestamp() {
  return new Date().toISOString();
}

export const logger = {
  info: (...args: any[]) => console.log(`[INFO] ${timestamp()}`, ...args),
  warn: (...args: any[]) => console.warn(`[WARN] ${timestamp()}`, ...args),
  error: (...args: any[]) => console.error(`[ERROR] ${timestamp()}`, ...args),
  debug: (...args: any[]) => {
    if (isDev) console.debug(`[DEBUG] ${timestamp()}`, ...args);
  },
};

export default logger;

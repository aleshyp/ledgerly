/** Deliberately loose: the server (or the email itself) is the real check. */
export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

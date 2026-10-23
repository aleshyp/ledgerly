export const settingsTabs = ["profile", "notifications", "workspace"] as const;

export type SettingsTab = (typeof settingsTabs)[number];

export const isSettingsTab = (value: string): value is SettingsTab =>
  settingsTabs.some((tab) => tab === value);

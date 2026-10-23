import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SettingsTabs } from "./settings-tabs";
import { isSettingsTab } from "./tabs";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile, notifications and workspace."
      />
      <SettingsTabs initialTab={typeof tab === "string" && isSettingsTab(tab) ? tab : "profile"} />
    </>
  );
}

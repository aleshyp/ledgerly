import Link from "next/link";
import { Text } from "@ledgerly/ui";
import { Logo } from "@/components/logo";
import { AuthAside } from "./auth-aside";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" aria-label="Ledgerly home" className="w-fit">
          <Logo />
        </Link>
        <div className="mx-auto grid w-full max-w-sm flex-1 content-center gap-8 py-12">
          {children}
        </div>
        <Text size="xs" tone="muted">
          Demo only — any details work, and nothing is sent anywhere.
        </Text>
      </div>
      <AuthAside />
    </main>
  );
}

import Link from "next/link";
import { Badge, Text } from "@ledgerly/ui";
import { AppNav } from "@/components/app-nav";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { currentUser } from "@/lib/data";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-muted/40 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r bg-surface px-4 py-5 lg:flex">
        <Link href="/" aria-label="Ledgerly home" className="px-2">
          <Logo />
        </Link>
        <AppNav />
        <div className="mt-auto grid gap-1 rounded-lg border bg-muted p-3">
          <Text as="div" size="sm" weight="semibold">
            {currentUser.company}
          </Text>
          <Text as="div" size="xs" tone="muted">
            Growth plan
          </Text>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-(--ld-z-sticky) border-b bg-surface/85 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <Link href="/" aria-label="Ledgerly home" className="lg:hidden">
              <Logo />
            </Link>
            <Badge variant="warning" className="hidden sm:inline-flex">
              Demo data
            </Badge>
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
          <div className="border-t px-4 py-2 lg:hidden">
            <AppNav orientation="horizontal" />
          </div>
        </header>
        <main
          id="main-content"
          className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

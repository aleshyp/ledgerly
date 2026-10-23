"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@ledgerly/ui";
import { ArrowLeftRight, CreditCard, FileText, LayoutDashboard, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppNav({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const pathname = usePathname();
  const vertical = orientation === "vertical";

  return (
    <nav aria-label="App" className={cn("flex gap-1", vertical ? "flex-col" : "overflow-x-auto")}>
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              "text-foreground-muted hover:bg-accent hover:text-foreground",
              "focus-visible:outline-2 focus-visible:outline-ring",
              "aria-[current=page]:bg-brand-subtle aria-[current=page]:text-brand-subtle-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

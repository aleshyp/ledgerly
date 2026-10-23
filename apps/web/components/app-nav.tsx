"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, cn } from "@ledgerly/ui";
import { ArrowLeftRight, CreditCard, FileText, LayoutDashboard, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/settings", label: "Settings", icon: Settings },
];

const comingSoon = [
  { label: "Cards", icon: CreditCard },
  { label: "Invoices", icon: FileText },
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
      {vertical &&
        comingSoon.map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground-muted"
          >
            <Icon className="size-4" />
            {label}
            <Badge variant="outline" className="ml-auto">
              Soon
            </Badge>
          </span>
        ))}
    </nav>
  );
}

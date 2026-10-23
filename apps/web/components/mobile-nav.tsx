import Link from "next/link";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ledgerly/ui";
import { Menu } from "lucide-react";
import { ThemeMenuItem } from "./theme-toggle";

/** The marketing nav below `md`, where the inline links don’t fit. */
export function MobileNav({ links }: { links: Array<{ href: string; label: string }> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {links.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href}>{link.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/login">Sign in</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">View live demo</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="sm:hidden" />
        <ThemeMenuItem className="sm:hidden" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

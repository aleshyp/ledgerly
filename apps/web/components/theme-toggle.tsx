"use client";

import { Button, DropdownMenuItem, Tooltip, TooltipContent, TooltipTrigger } from "@ledgerly/ui";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle color theme"
          className={className}
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {/* Both icons render; CSS picks one so server and client markup match. */}
          <Sun className="hidden dark:block" />
          <Moon className="dark:hidden" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}

/** The same switch as a menu item, for menus that replace the header toggle on small screens. */
export function ThemeMenuItem({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenuItem
      className={className}
      onSelect={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* CSS picks the label, like the icons above, so server and client markup match. */}
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
      <span className="dark:hidden">Dark theme</span>
      <span className="hidden dark:inline">Light theme</span>
    </DropdownMenuItem>
  );
}

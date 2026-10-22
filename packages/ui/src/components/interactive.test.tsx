import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";
import { Label } from "./label";
import { SkipLink } from "./skip-link";
import { Switch } from "./switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Checkbox", () => {
  it("toggles when its label is clicked", async () => {
    render(
      <>
        <Checkbox id="summary" />
        <Label htmlFor="summary">Weekly summary</Label>
      </>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Weekly summary" });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(screen.getByText("Weekly summary"));
    expect(checkbox).toBeChecked();
  });
});

describe("Switch", () => {
  it("toggles with the keyboard", async () => {
    render(<Switch aria-label="Autopay" />);
    const toggle = screen.getByRole("switch", { name: "Autopay" });
    toggle.focus();
    await userEvent.keyboard(" ");
    expect(toggle).toBeChecked();
  });
});

describe("Dialog", () => {
  it("opens, traps focus and closes on Escape", async () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Transfer funds</DialogTitle>
          <DialogDescription>Move money between accounts.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog", { name: "Transfer funds" });
    expect(dialog).toHaveAccessibleDescription("Move money between accounts.");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Tabs", () => {
  it("switches panels with arrow keys", async () => {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Overview</TabsTrigger>
          <TabsTrigger value="b">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Overview panel</TabsContent>
        <TabsContent value="b">Activity panel</TabsContent>
      </Tabs>,
    );
    screen.getByRole("tab", { name: "Overview" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Activity" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Activity panel");
  });
});

describe("SkipLink", () => {
  it("is the first tab stop and points at the main landmark", async () => {
    render(
      <>
        <SkipLink />
        <nav>
          <a href="#pricing">Pricing</a>
        </nav>
        <main id="main-content">Content</main>
      </>,
    );
    await userEvent.tab();
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("href", "#main-content");
  });
});

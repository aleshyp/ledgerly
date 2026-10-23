import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Toaster, toast } from "./toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

describe("DropdownMenu", () => {
  it("opens from the keyboard and runs the chosen item", async () => {
    const onEdit = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onEdit}>Edit category</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    screen.getByRole("button", { name: "Actions" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByRole("menuitem", { name: "Edit category" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onEdit).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});

describe("Select", () => {
  it("picks an option with the keyboard", async () => {
    const onValueChange = vi.fn();
    render(
      <Select defaultValue="software" onValueChange={onValueChange}>
        <SelectTrigger aria-label="Category">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="software">Software</SelectItem>
          <SelectItem value="travel">Travel</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Category" });
    expect(trigger).toHaveTextContent("Software");
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("travel");
    expect(trigger).toHaveTextContent("Travel");
  });
});

describe("RadioGroup", () => {
  // Radix checks an item as arrow keys focus it; jsdom doesn't replay that focus, so Space confirms.
  it("moves between options with arrow keys", async () => {
    render(
      <RadioGroup defaultValue="realtime" aria-label="Alert frequency">
        {["realtime", "daily"].map((value) => (
          <div key={value}>
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value}>{value === "realtime" ? "As they happen" : "Daily"}</Label>
          </div>
        ))}
      </RadioGroup>,
    );
    screen.getByRole("radio", { name: "As they happen" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    const daily = screen.getByRole("radio", { name: "Daily" });
    expect(daily).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(daily).toBeChecked();
    expect(screen.getByRole("radio", { name: "As they happen" })).not.toBeChecked();
  });
});

describe("Tooltip", () => {
  it("shows its content when the trigger gets keyboard focus", async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Theme</TooltipTrigger>
          <TooltipContent>Toggle theme</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await userEvent.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Toggle theme");
  });
});

describe("Toaster", () => {
  it("announces a toast and runs its action", async () => {
    const onUndo = vi.fn();
    render(<Toaster />);
    act(() => {
      toast({
        title: "Transaction deleted",
        action: { label: "Undo", altText: "Undo deleting the transaction", onClick: onUndo },
      });
    });
    expect(await screen.findByText("Transaction deleted")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it("can be dismissed", async () => {
    render(<Toaster />);
    act(() => {
      toast({ title: "Copied" });
    });
    await userEvent.click(await screen.findByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Copied")).not.toBeInTheDocument();
  });
});

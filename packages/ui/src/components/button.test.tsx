import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("calls onClick when pressed", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Pay</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Pay" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled and busy while loading", () => {
    render(<Button loading>Pay</Button>);
    const button = screen.getByRole("button", { name: "Pay" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("renders its child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/pricing">Pricing</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link).toHaveAttribute("href", "/pricing");
    expect(link).toHaveAttribute("data-slot", "button");
  });

  it("removes size padding from link buttons", () => {
    render(
      <Button variant="link" size="sm">
        Forgot password?
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-0");
    expect(button).not.toHaveClass("px-3");
  });

  it("lets className override variant styles", () => {
    render(<Button className="px-8">Pay</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-8");
    expect(button).not.toHaveClass("px-4");
  });
});

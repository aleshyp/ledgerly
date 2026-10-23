import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert, AlertTitle } from "./alert";
import { Card, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { Spinner } from "./spinner";
import { StatCard } from "./stat-card";

describe("CardTitle", () => {
  it("is a level 3 heading by default", () => {
    render(<CardTitle>Accounts</CardTitle>);
    expect(screen.getByRole("heading", { level: 3, name: "Accounts" })).toBeInTheDocument();
  });

  it("takes its outline level from the page structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle level={2}>Budgets</CardTitle>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Budgets" })).toBeInTheDocument();
  });

  it("renders its child instead of a heading with asChild", () => {
    render(
      <CardTitle asChild>
        <p>$84,320.18</p>
      </CardTitle>,
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByText("$84,320.18")).toHaveAttribute("data-slot", "card-title");
  });
});

describe("Progress", () => {
  it("exposes its value to assistive tech", () => {
    render(<Progress value={64} aria-label="Software budget used" />);
    const bar = screen.getByRole("progressbar", { name: "Software budget used" });
    expect(bar).toHaveAttribute("aria-valuenow", "64");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });
});

describe("Alert", () => {
  it("announces errors immediately and everything else politely", () => {
    render(
      <>
        <Alert variant="danger">
          <AlertTitle>Payment failed</AlertTitle>
        </Alert>
        <Alert variant="success">
          <AlertTitle>Profile updated</AlertTitle>
        </Alert>
      </>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Payment failed");
    expect(screen.getByRole("status")).toHaveTextContent("Profile updated");
  });
});

describe("Spinner", () => {
  it("is hidden from assistive tech", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("StatCard", () => {
  it("shows the label, value and meta line", () => {
    render(<StatCard label="Money in" value="$48,210.00" meta="14 transactions" />);
    expect(screen.getByText("Money in")).toBeInTheDocument();
    expect(screen.getByText("$48,210.00")).toHaveAttribute("data-slot", "stat-card-value");
    expect(screen.getByText("14 transactions")).toHaveAttribute("data-slot", "stat-card-meta");
  });

  it("leaves out the meta line when there's nothing to say", () => {
    const { container } = render(<StatCard label="Frozen" value="0" meta={false} />);
    expect(container.querySelector("[data-slot=stat-card-meta]")).toBeNull();
  });
});

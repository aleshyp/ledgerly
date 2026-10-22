import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./field";
import { Input } from "./input";

describe("Field", () => {
  it("associates the label with the control", () => {
    render(
      <Field label="Email">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
  });

  it("describes the control with help text and errors", () => {
    render(
      <Field label="Routing number" description="Nine digits" error="Too short">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText("Routing number");
    expect(input).toHaveAccessibleDescription("Nine digits Too short");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("marks the control required", () => {
    render(
      <Field label="Name" required>
        <Input />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: /Name/ })).toBeRequired();
  });

  it("keeps explicit control props", () => {
    render(
      <Field label="Amount">
        <Input id="custom" aria-describedby="elsewhere" />
      </Field>,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "custom");
    expect(input).toHaveAttribute("aria-describedby", "elsewhere");
  });
});

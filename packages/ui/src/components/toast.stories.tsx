import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleCheck } from "lucide-react";
import { Button } from "./button";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
  toast,
} from "./toast";

const meta = {
  title: "Components/Toast",
  component: Toaster,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Call `toast()` from any event handler; `<Toaster />` renders the queue. */
export const Imperative: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() => toast({ title: "Copied", description: "Transaction ID copied." })}
      >
        Neutral
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Transaction saved",
            description: "Farmers market · −$84.20",
            variant: "success",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Transaction deleted",
            description: "AWS · −$1,218.40",
            action: { label: "Undo", altText: "Undo deleting the transaction", onClick: () => {} },
          })
        }
      >
        With undo
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast({
            title: "Export failed",
            description: "Try again in a moment.",
            variant: "danger",
          })
        }
      >
        Danger
      </Button>
      <Toaster />
    </div>
  ),
};

/** The parts, composed by hand and held open, for visual review. */
export const Variants: Story = {
  render: () => (
    <ToastProvider duration={Infinity}>
      <Toast open>
        <span />
        <ToastTitle>Copied</ToastTitle>
        <ToastDescription>Transaction ID copied.</ToastDescription>
        <ToastClose />
      </Toast>
      <Toast open variant="success">
        <CircleCheck aria-hidden="true" />
        <ToastTitle>Transaction saved</ToastTitle>
        <ToastDescription>Farmers market · −$84.20</ToastDescription>
        <ToastAction altText="Open the transactions page">View</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport className="static w-96 p-0" />
    </ToastProvider>
  ),
};

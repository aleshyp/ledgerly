import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Pending" },
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "brand", "success", "warning", "danger", "info", "outline"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="neutral">Draft</Badge>
      <Badge variant="brand">New</Badge>
      <Badge variant="success">Paid</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="danger">Failed</Badge>
      <Badge variant="info">Scheduled</Badge>
      <Badge variant="outline">Manual</Badge>
    </div>
  ),
};

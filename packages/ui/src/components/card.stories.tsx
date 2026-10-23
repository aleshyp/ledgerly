import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreHorizontal, TrendingUp } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Operating account</CardTitle>
        <CardDescription>Northwind Bank ···· 4821</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="Account options">
            <MoreHorizontal />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">$84,320.18</div>
      </CardContent>
      <CardFooter className="justify-between">
        <Badge variant="success">
          <TrendingUp /> 12.4%
        </Badge>
        <Button variant="outline" size="sm">
          View activity
        </Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * `CardTitle` is a heading. Set `level` to fit the page outline (2 under a page’s h1, 3 under a
 * section’s h2), or use `asChild` when the title is a value rather than a heading.
 */
export const HeadingLevels: Story = {
  render: () => (
    <div className="grid w-96 gap-4">
      <Card>
        <CardHeader>
          <CardTitle level={2}>Budgets</CardTitle>
          <CardDescription>Level 2, directly under the page heading</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Operating ···· 4821</CardDescription>
          <CardTitle asChild className="text-3xl">
            <p>$84,320.18</p>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  ),
};

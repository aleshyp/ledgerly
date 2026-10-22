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

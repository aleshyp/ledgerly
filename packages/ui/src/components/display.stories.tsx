import type { Meta, StoryObj } from "@storybook/react-vite";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Progress } from "./progress";
import { Separator } from "./separator";
import { Skeleton } from "./skeleton";
import { SkipLink } from "./skip-link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Heading, Text } from "./typography";

const meta = {
  title: "Components/Display",
  component: Alert,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alerts: Story = {
  render: () => (
    <div className="grid max-w-xl gap-3">
      <Alert>
        <Info />
        <AlertTitle>Statements are ready</AlertTitle>
        <AlertDescription>
          Your September statements can be downloaded from Reports.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <Info />
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>ACH transfers pause Sunday 02:00–03:00 UTC.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheck />
        <AlertTitle>Bank connected</AlertTitle>
        <AlertDescription>We imported 1,284 transactions from Northwind Bank.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>Budget almost reached</AlertTitle>
        <AlertDescription>Software spend is at 92% of this month’s budget.</AlertDescription>
      </Alert>
      <Alert variant="danger">
        <CircleAlert />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>The card ending 0042 was declined. Update it to retry.</AlertDescription>
      </Alert>
    </div>
  ),
};

export const Avatars: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/96?img=47" alt="Avery Chen" />
        <AvatarFallback>AC</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>NW</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const ProgressBars: Story = {
  render: () => (
    <div className="grid max-w-sm gap-4">
      <Progress value={32} aria-label="Marketing budget" />
      <Progress value={64} tone="success" aria-label="Savings goal" />
      <Progress value={88} tone="warning" aria-label="Software budget" />
      <Progress value={100} tone="danger" aria-label="Travel budget" />
    </div>
  ),
};

/** `entrance="fill"` grows each bar from empty on first paint. Remount the story to replay it. */
export const ProgressFillEntrance: Story = {
  render: () => (
    <div className="grid max-w-sm gap-4">
      <div className="stagger-0">
        <Progress value={32} entrance="fill" aria-label="Marketing budget" />
      </div>
      <div className="stagger-2">
        <Progress value={64} tone="success" entrance="fill" aria-label="Savings goal" />
      </div>
      <div className="stagger-4">
        <Progress value={88} tone="warning" entrance="fill" aria-label="Software budget" />
      </div>
    </div>
  ),
};

export const TabsExample: Story = {
  name: "Tabs",
  render: () => (
    <Tabs defaultValue="overview" className="max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="statements">Statements</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Text tone="muted" size="sm">
          Balances, upcoming bills and cash flow at a glance.
        </Text>
      </TabsContent>
      <TabsContent value="activity">
        <Text tone="muted" size="sm">
          Every transaction across connected accounts.
        </Text>
      </TabsContent>
      <TabsContent value="statements">
        <Text tone="muted" size="sm">
          Monthly PDF statements going back 7 years.
        </Text>
      </TabsContent>
    </Tabs>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-4">
      <Heading level={1} size="display">
        Finance, finally calm.
      </Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
      <Separator />
      <Text>Body text in the default tone for long-form reading and descriptions.</Text>
      <Text tone="muted" size="sm">
        Muted, small supporting text for captions and metadata.
      </Text>
      <div className="flex gap-6">
        <Text as="span" tone="positive" weight="semibold" className="tabular">
          +$12,400.00
        </Text>
        <Text as="span" tone="negative" weight="semibold" className="tabular">
          −$3,218.40
        </Text>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex max-w-sm items-center gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  ),
};

export const SkipToContent: Story = {
  parameters: {
    docs: {
      description: { story: "Hidden until focused. Press Tab inside the canvas to reveal it." },
    },
  },
  render: () => (
    <div className="grid gap-2">
      <SkipLink href="#story-main" />
      <Text tone="muted" size="sm">
        Navigation would sit here.
      </Text>
      <main id="story-main">
        <Text>Main content</Text>
      </main>
    </div>
  ),
};

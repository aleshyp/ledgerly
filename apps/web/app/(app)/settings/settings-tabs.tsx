"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from "@ledgerly/ui";
import { CircleCheck } from "lucide-react";
import { currentUser } from "@/lib/data";
import { initials } from "@/lib/format";

const notifications = [
  {
    id: "large",
    label: "Large transactions",
    description: "Any single charge over $1,000.",
    on: true,
  },
  {
    id: "budget",
    label: "Budget alerts",
    description: "When a category reaches 85% of its limit.",
    on: true,
  },
  {
    id: "failed",
    label: "Failed payments",
    description: "Declines and returned ACH transfers.",
    on: true,
  },
  {
    id: "digest",
    label: "Weekly digest",
    description: "A Monday summary of cash in and out.",
    on: false,
  },
];

export function SettingsTabs() {
  const [saved, setSaved] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  return (
    <Tabs defaultValue="profile" className="gap-6">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="workspace">Workspace</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="grid max-w-3xl gap-6">
        {saved && (
          <Alert variant="success">
            <CircleCheck />
            <AlertTitle>Profile updated</AlertTitle>
            <AlertDescription>Your changes have been saved.</AlertDescription>
          </Alert>
        )}
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
            }}
            className="grid gap-6"
          >
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This information appears on approvals and audit logs.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center gap-4">
                <Avatar size="lg">
                  <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm">
                  Upload photo
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <Input name="name" defaultValue={currentUser.name} autoComplete="name" />
                </Field>
                <Field label="Role">
                  <Input name="role" defaultValue={currentUser.role} />
                </Field>
              </div>
              <Field label="Email" description="Used to sign in and receive alerts.">
                <Input
                  name="email"
                  type="email"
                  defaultValue={currentUser.email}
                  autoComplete="email"
                />
              </Field>
              <Field label="Time zone">
                <Select defaultValue="america-los_angeles">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-los_angeles">Pacific Time (US & Canada)</SelectItem>
                    <SelectItem value="america-denver">Mountain Time (US & Canada)</SelectItem>
                    <SelectItem value="america-chicago">Central Time (US & Canada)</SelectItem>
                    <SelectItem value="america-new_york">Eastern Time (US & Canada)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
            <CardFooter className="justify-end gap-2 border-t pt-6">
              <Button type="reset" variant="ghost" onClick={() => setSaved(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="grid max-w-3xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Email notifications</CardTitle>
            <CardDescription>Choose what Ledgerly emails you about.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            {notifications.map((n, i) => (
              <div key={n.id} className="grid gap-5">
                {i > 0 && <Separator />}
                <div className="flex items-start justify-between gap-6">
                  <div className="grid gap-1">
                    <Label htmlFor={`notify-${n.id}`}>{n.label}</Label>
                    <Text size="sm" tone="muted">
                      {n.description}
                    </Text>
                  </div>
                  <Switch id={`notify-${n.id}`} defaultChecked={n.on} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Delivery</CardTitle>
            <CardDescription>How often should we bundle non-urgent alerts?</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="realtime" aria-label="Alert frequency">
              {[
                { value: "realtime", label: "As they happen" },
                { value: "hourly", label: "Hourly summary" },
                { value: "daily", label: "Daily summary" },
              ].map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroupItem value={option.value} id={`freq-${option.value}`} />
                  <Label htmlFor={`freq-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="workspace" className="grid max-w-3xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Settings shared by everyone at {currentUser.company}.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Legal name">
              <Input defaultValue={currentUser.company} />
            </Field>
            <Field label="Fiscal year starts">
              <Select defaultValue="jan">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan">January</SelectItem>
                  <SelectItem value="apr">April</SelectItem>
                  <SelectItem value="jul">July</SelectItem>
                  <SelectItem value="oct">October</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>
        <Card className="border-danger/40">
          <CardHeader>
            <CardTitle>Close workspace</CardTitle>
            <CardDescription>
              Permanently close all accounts and delete workspace data. This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Dialog onOpenChange={() => setConfirmText("")}>
              <DialogTrigger asChild>
                <Button variant="danger">Close workspace</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Close {currentUser.company}?</DialogTitle>
                  <DialogDescription>
                    All balances must be transferred out first. Type <strong>CLOSE</strong> to
                    confirm.
                  </DialogDescription>
                </DialogHeader>
                <Field label="Confirmation">
                  <Input
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    autoComplete="off"
                  />
                </Field>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Keep workspace</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button variant="danger" disabled={confirmText !== "CLOSE"}>
                      Close workspace
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
  Switch,
  cn,
} from "@ledgerly/ui";
import { Check } from "lucide-react";
import { plans } from "@/lib/data";
import { formatPrice } from "@/lib/format";

const bestSaving = Math.max(
  ...plans.filter((p) => p.monthly > 0).map((p) => Math.round((1 - p.annual / p.monthly) * 100)),
);

export function PricingPlans() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="grid gap-10">
      <div className="flex items-center justify-center gap-3">
        <Switch id="billing" checked={annual} onCheckedChange={setAnnual} />
        <Label htmlFor="billing">
          Bill annually <Badge variant="success">Save up to {bestSaving}%</Badge>
        </Label>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = annual ? plan.annual : plan.monthly;
          return (
            <Card
              key={plan.name}
              className={cn(plan.featured && "border-primary shadow-lg ring-1 ring-primary")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle level={2} className="text-lg">
                    {plan.name}
                  </CardTitle>
                  {plan.featured && <Badge variant="brand">Most popular</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold tabular">{formatPrice(price)}</span>
                  <span className="text-sm text-foreground-muted">
                    / month{price > 0 && annual ? ", billed annually" : ""}
                  </span>
                </div>
                <ul className="grid gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-positive" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={plan.featured ? "primary" : "outline"}>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

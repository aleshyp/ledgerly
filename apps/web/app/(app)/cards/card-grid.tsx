"use client";

import {
  Badge,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Text,
  toast,
} from "@ledgerly/ui";
import { CircleCheck, Snowflake } from "lucide-react";
import { useTransactions } from "@/components/transactions-provider";
import { type CompanyCard, cardSpend } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { useCards } from "./cards-provider";

export function CardGrid() {
  const { cards, update } = useCards();
  const { transactions } = useTransactions();

  function onToggleFreeze(card: CompanyCard) {
    const frozen = card.status === "active";
    update(card.id, { status: frozen ? "frozen" : "active" });
    toast({
      title: frozen ? `${card.name} card frozen` : `${card.name} card unfrozen`,
      description: frozen
        ? "New charges will be declined until you unfreeze it."
        : "The card works again, up to its monthly limit.",
    });
  }

  if (cards.length === 0) {
    return (
      <Card className="items-center px-6 py-16 text-center">
        <div className="grid gap-1">
          <Text weight="medium">No cards yet</Text>
          <Text size="sm" tone="muted" className="max-w-prose text-pretty">
            Issue a virtual card for a subscription, or a physical card for someone on your team.
            Use “Issue card” to create one.
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <ul aria-label="Company cards" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const spent = cardSpend(transactions, card.id);
        const ratio = spent / card.limit;
        const tone = ratio > 1 ? "danger" : ratio > 0.85 ? "warning" : "primary";
        const frozen = card.status === "frozen";

        return (
          <li key={card.id} className="grid">
            <Card>
              <CardHeader>
                <CardTitle level={2} className="text-balance">
                  {card.name}
                </CardTitle>
                <CardDescription>
                  <span className="capitalize">{card.kind}</span>{" "}
                  <span className="tabular">···· {card.mask}</span> · {card.holder}
                </CardDescription>
                <CardAction>
                  {frozen ? (
                    <Badge variant="info">
                      <Snowflake /> Frozen
                    </Badge>
                  ) : (
                    <Badge variant="success">
                      <CircleCheck /> Active
                    </Badge>
                  )}
                </CardAction>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium tabular">{formatCurrency(spent)} spent</span>
                  <span className="text-xs text-foreground-muted tabular">
                    of {formatCurrency(card.limit)} a month
                  </span>
                </div>
                <Progress
                  value={Math.min(ratio, 1) * 100}
                  tone={tone}
                  aria-label={`${card.name} limit used`}
                />
                <Text size="xs" tone="muted" className="tabular">
                  {spent > card.limit
                    ? `${formatCurrency(spent - card.limit)} over the limit`
                    : `${formatCurrency(card.limit - spent)} left this month`}
                </Text>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  // Starts with the visible text (2.5.3), and names the card for screen readers.
                  aria-label={`${frozen ? "Unfreeze card" : "Freeze card"}, ${card.name}`}
                  onClick={() => onToggleFreeze(card)}
                >
                  <Snowflake />
                  {frozen ? "Unfreeze card" : "Freeze card"}
                </Button>
              </CardFooter>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}

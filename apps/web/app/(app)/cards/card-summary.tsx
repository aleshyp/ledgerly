"use client";

import { Badge, Progress, StatCard } from "@ledgerly/ui";
import { TriangleAlert } from "lucide-react";
import { useTransactions } from "@/components/transactions-provider";
import { cardSpend } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { useCards } from "./cards-provider";

const plural = (count: number) => `${count} card${count === 1 ? "" : "s"}`;

/** Same threshold as each card’s progress bar turning to a warning. */
const NEAR_LIMIT = 0.85;

export function CardSummary() {
  const { cards } = useCards();
  const { transactions } = useTransactions();
  if (cards.length === 0) return null;

  const spend = cards.map((card) => ({ card, spent: cardSpend(transactions, card.id) }));
  const spent = spend.reduce((sum, s) => sum + s.spent, 0);
  const limit = cards.reduce((sum, card) => sum + card.limit, 0);
  const nearLimit = spend.filter((s) => s.spent / s.card.limit > NEAR_LIMIT);
  const over = nearLimit.filter((s) => s.spent > s.card.limit);
  const frozen = cards.filter((card) => card.status === "frozen");

  return (
    <section aria-label="Card summary" className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Spent this month"
        value={formatCurrency(spent)}
        meta={`of ${formatCurrency(limit)} in monthly limits`}
      >
        <Progress
          value={Math.min(spent / limit, 1) * 100}
          tone={spent > limit ? "danger" : spent / limit > NEAR_LIMIT ? "warning" : "primary"}
          aria-label="Monthly card limits used"
        />
      </StatCard>
      <StatCard
        label="Near their limit"
        value={plural(nearLimit.length)}
        meta={
          over.length > 0 ? (
            <Badge variant="danger">
              <TriangleAlert /> {plural(over.length)} over the limit
            </Badge>
          ) : (
            `Over ${NEAR_LIMIT * 100}% of their monthly limit`
          )
        }
      />
      <StatCard
        label="Frozen"
        value={plural(frozen.length)}
        meta={frozen.length > 0 ? "New charges are declined" : "Every card can take charges"}
      />
    </section>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { companyCards } from "@/lib/data";
import { CardGrid } from "./card-grid";
import { CardSummary } from "./card-summary";
import { CardsProvider } from "./cards-provider";
import { IssueCardDialog } from "./issue-card-dialog";

export const metadata: Metadata = { title: "Cards" };

export default function CardsPage() {
  return (
    <CardsProvider initial={companyCards}>
      <PageHeader
        title="Cards"
        description="Issue cards, set monthly limits and freeze a card the moment something looks off."
        actions={<IssueCardDialog />}
      />
      <CardSummary />
      <CardGrid />
    </CardsProvider>
  );
}

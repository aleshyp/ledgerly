"use client";

import { createContext, use, useState } from "react";
import type { CompanyCard } from "@/lib/data";

type CardsContextValue = {
  cards: CompanyCard[];
  add: (card: Omit<CompanyCard, "id">) => CompanyCard;
  update: (id: string, patch: Partial<Omit<CompanyCard, "id">>) => void;
};

const CardsContext = createContext<CardsContextValue | null>(null);

let issued = 0;

/** Holds the page’s cards in memory, so the header’s dialog and the grid share them. */
export function CardsProvider({
  initial,
  children,
}: {
  initial: CompanyCard[];
  children: React.ReactNode;
}) {
  const [cards, setCards] = useState(initial);

  const value: CardsContextValue = {
    cards,
    add(input) {
      issued += 1;
      const card = { ...input, id: `card_new_${issued}` };
      setCards((list) => [...list, card]);
      return card;
    },
    update(id, patch) {
      setCards((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
  };

  return <CardsContext value={value}>{children}</CardsContext>;
}

export function useCards() {
  const context = use(CardsContext);
  if (!context) throw new Error("useCards must be used inside CardsProvider.");
  return context;
}

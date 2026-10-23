export const topics = {
  sales: "Sales and pricing",
  support: "Help with my account",
  partnerships: "Partnerships",
} as const satisfies Record<string, string>;

export type Topic = keyof typeof topics;

export const isTopic = (value: string): value is Topic => Object.hasOwn(topics, value);

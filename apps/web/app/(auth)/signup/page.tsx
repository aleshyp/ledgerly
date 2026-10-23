import type { Metadata } from "next";
import { plans } from "@/lib/data";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Create your account" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const { plan } = await searchParams;
  const chosen = plans.find((p) => p.name.toLowerCase() === plan && p.monthly > 0);
  return <SignupForm planName={chosen?.name} />;
}

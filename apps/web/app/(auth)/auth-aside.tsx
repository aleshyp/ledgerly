/** The brand panel beside every auth form. Decorative, so it hides below `lg`. */
export function AuthAside() {
  return (
    <div className="relative hidden overflow-hidden bg-primary lg:block">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--color-spotlight-1),transparent_55%),radial-gradient(circle_at_80%_80%,var(--color-spotlight-2),transparent_50%)] opacity-70"
      />
      <figure className="relative flex h-full flex-col justify-end gap-6 p-12 text-primary-foreground">
        <blockquote className="max-w-md text-2xl font-medium text-balance">
          “Ledgerly gave us a real-time view of cash for the first time. Month-end used to be a
          dread; now it’s a Tuesday.”
        </blockquote>
        <figcaption className="text-sm">Priya Raman — COO, Fernhill Bakery</figcaption>
      </figure>
    </div>
  );
}

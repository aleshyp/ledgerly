/** The brand panel beside every auth form. Decorative, so it hides below `lg`. */
export function AuthAside() {
  return (
    <div className="relative isolate hidden overflow-hidden bg-brand-panel lg:block">
      {/* One brand-hue glow: a second, contrasting hue muddies on a saturated fill. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_15%,var(--color-spotlight-1),transparent_55%)] opacity-40"
      />
      <figure className="flex h-full flex-col justify-end gap-6 p-12 text-brand-panel-foreground">
        <blockquote className="max-w-md text-2xl font-medium text-balance">
          “Ledgerly gave us a real-time view of cash for the first time. Month-end used to be a
          dread; now it’s a Tuesday.”
        </blockquote>
        <figcaption className="text-sm">Priya Raman — COO, Fernhill Bakery</figcaption>
      </figure>
    </div>
  );
}

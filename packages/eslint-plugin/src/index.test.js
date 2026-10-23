import { RuleTester } from "eslint";
import { afterAll, describe, it } from "vitest";
import plugin from "./index.js";

RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const tester = new RuleTester({
  languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
});

const { rules } = plugin;

tester.run("no-primitive-colors", rules["no-primitive-colors"], {
  valid: [
    `<div className="bg-primary text-foreground-muted" />`,
    `cn("border-border-strong", isActive && "bg-brand-subtle")`,
    `<p>Your balance grew 12% in March</p>`,
  ],
  invalid: [
    { code: `<div className="bg-brand-500" />`, errors: [{ messageId: "primitive" }] },
    { code: `cn("p-4 dark:hover:text-red-700/50")`, errors: [{ messageId: "primitive" }] },
    { code: "const c = `stroke-coral-300 ${x}`", errors: [{ messageId: "primitive" }] },
    { code: `const s = "var(--color-brand-500)"`, errors: [{ messageId: "primitive" }] },
  ],
});

tester.run("no-arbitrary-values", rules["no-arbitrary-values"], {
  valid: [
    `<div className="grid grid-cols-[16rem_1fr]" />`,
    `<div className="w-[calc(100%-2rem)] transition-[color,box-shadow]" />`,
    `<div className="[&_svg]:size-4 data-[state=open]:bg-accent" />`,
  ],
  invalid: [
    { code: `<div className="p-[13px]" />`, errors: [{ messageId: "length" }] },
    { code: `<div className="rounded-[3rem]" />`, errors: [{ messageId: "length" }] },
    { code: `<span className="text-[10px]" />`, errors: [{ messageId: "length" }] },
    { code: `<div className="bg-[#0af]" />`, errors: [{ messageId: "color" }] },
    { code: `cn("border-[oklch(0.5_0.1_200)]")`, errors: [{ messageId: "color" }] },
  ],
});

tester.run("no-transition-all", rules["no-transition-all"], {
  valid: [`<div className="transition-colors duration-150" />`],
  invalid: [
    { code: `<div className="transition-all" />`, errors: [{ messageId: "all" }] },
    { code: `const css = "transition: all 200ms"`, errors: [{ messageId: "all" }] },
  ],
});

tester.run("typography", rules.typography, {
  valid: [
    `<p>It’s “done”…</p>`,
    `<Input placeholder="Search transactions…" />`,
    `<Comp {...props} />`,
    `<a href="https://example.com/'x'">Link</a>`,
  ],
  invalid: [
    {
      code: `<p>Loading...</p>`,
      output: `<p>Loading…</p>`,
      errors: [{ messageId: "ellipsis" }],
    },
    {
      code: `<Input placeholder="Search..." />`,
      output: `<Input placeholder="Search…" />`,
      errors: [{ messageId: "ellipsis" }],
    },
    { code: `<p>Don't panic</p>`, errors: [{ messageId: "quote" }] },
    { code: `<Button aria-label="Close 'dialog'" />`, errors: [{ messageId: "quote" }] },
  ],
});

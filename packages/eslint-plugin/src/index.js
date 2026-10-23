/* ----------------------------------------------------------------------------
 * Ledgerly lint rules. Each one turns a convention from `.claude/rules/` into
 * a CI failure, so the design system can't be bypassed by accident.
 *
 * Class-name rules inspect every string and template literal in a file. The
 * patterns are specific enough (`bg-brand-500`, `p-[13px]`) that prose doesn't
 * trip them.
 * ------------------------------------------------------------------------- */

const PALETTES = "neutral|brand|coral|blue|green|amber|red";
const COLOR_UTILITIES =
  "bg|text|border(?:-[trblxyse])?|ring|ring-offset|outline|fill|stroke|from|via|to|divide|decoration|caret|accent|placeholder|shadow|inset-shadow";

/** `bg-brand-500`, `dark:hover:text-red-700/50` */
const primitiveUtility = new RegExp(
  `(?:^|[\\s:"'\`!])(?:${COLOR_UTILITIES})-(?:${PALETTES})-\\d{2,3}\\b`,
);
/** `var(--color-brand-500)`, `var(--ld-color-red-700)` */
const primitiveVar = new RegExp(`--(?:ld-)?color-(?:${PALETTES})-\\d{2,3}\\b`);

/** `bg-[#0af]`, `text-[rgb(0_0_0)]`, `border-[oklch(...)]` */
const arbitraryColor =
  /-\[(?:#[0-9a-f]{3,8}|(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color-mix)\()/i;
/** `p-[13px]`, `text-[10px]`, `rounded-[3rem]`, `-mt-[2.5em]`. Grid templates and calc() pass. */
const arbitraryLength = /-\[-?\d*\.?\d+(?:px|rem|em)\]/;

const transitionAll = /(?:^|[\s:"'`])transition-all\b|transition:\s*all\b/;

/** Runs `check` on every static string and template chunk in the file. */
function stringVisitor(check) {
  return {
    Literal(node) {
      if (typeof node.value === "string") check(node, node.value);
    },
    TemplateElement(node) {
      check(node, node.value.raw);
    },
  };
}

const noPrimitiveColors = {
  meta: {
    type: "problem",
    docs: { description: "Use semantic color tokens instead of raw palette steps." },
    messages: {
      primitive:
        "Raw palette color in `{{match}}`. Use a semantic token (bg-primary, text-foreground-muted, …) so theming keeps working. If no token fits, add one to packages/tokens/src/semantic.ts.",
    },
    schema: [],
  },
  create(context) {
    return stringVisitor((node, text) => {
      const match = text.match(primitiveUtility) ?? text.match(primitiveVar);
      if (match) context.report({ node, messageId: "primitive", data: { match: match[0].trim() } });
    });
  },
};

const noArbitraryValues = {
  meta: {
    type: "problem",
    docs: { description: "Disallow arbitrary Tailwind colors and lengths that bypass the scale." },
    messages: {
      color: "Arbitrary color `{{match}}`. Colors must come from tokens.",
      length:
        "Arbitrary length `{{match}}`. Use the spacing/type/radius scale (p-3, text-xs, rounded-2xl). Layout expressions like grid templates and calc() are fine.",
    },
    schema: [],
  },
  create(context) {
    return stringVisitor((node, text) => {
      const color = text.match(arbitraryColor);
      if (color) {
        context.report({ node, messageId: "color", data: { match: color[0] } });
        return;
      }
      const length = text.match(arbitraryLength);
      if (length) context.report({ node, messageId: "length", data: { match: length[0] } });
    });
  },
};

const noTransitionAll = {
  meta: {
    type: "problem",
    docs: { description: "Disallow `transition-all`; list the properties that animate." },
    messages: {
      all: "Avoid `transition-all`. Name the properties instead (transition-colors, transition-transform, transition-[color,box-shadow]).",
    },
    schema: [],
  },
  create(context) {
    return stringVisitor((node, text) => {
      if (transitionAll.test(text)) context.report({ node, messageId: "all" });
    });
  },
};

/** JSX attributes whose values are read by people, so they get typographic checks too. */
const PROSE_ATTRIBUTES = new Set([
  "alt",
  "aria-label",
  "aria-description",
  "label",
  "placeholder",
  "title",
]);

const typography = {
  meta: {
    type: "suggestion",
    docs: { description: "Use typographic punctuation in user-facing copy." },
    fixable: "code",
    messages: {
      ellipsis: "Use the ellipsis character (…) instead of three periods.",
      quote: "Use curly quotes in copy: ’ for apostrophes, “ ” for quotations.",
    },
    schema: [],
  },
  create(context) {
    const source = context.sourceCode;

    function check(node, text) {
      if (text.includes("...")) {
        context.report({
          node,
          messageId: "ellipsis",
          fix: (fixer) => fixer.replaceText(node, source.getText(node).replaceAll("...", "…")),
        });
      }
      if (/['"]/.test(text)) context.report({ node, messageId: "quote" });
    }

    return {
      JSXText(node) {
        check(node, node.value);
      },
      JSXAttribute(node) {
        const name = typeof node.name.name === "string" ? node.name.name : "";
        if (PROSE_ATTRIBUTES.has(name) && node.value?.type === "Literal") {
          // Strip the attribute's own quotes before looking for straight quotes.
          const value = node.value;
          if (value.value.includes("...")) {
            context.report({
              node: value,
              messageId: "ellipsis",
              fix: (fixer) =>
                fixer.replaceText(value, source.getText(value).replaceAll("...", "…")),
            });
          }
          if (/['"]/.test(value.value)) context.report({ node: value, messageId: "quote" });
        }
      },
    };
  },
};

const plugin = {
  meta: { name: "@ledgerly/eslint-plugin", version: "0.1.0" },
  rules: {
    "no-primitive-colors": noPrimitiveColors,
    "no-arbitrary-values": noArbitraryValues,
    "no-transition-all": noTransitionAll,
    typography,
  },
};

plugin.configs = {
  recommended: {
    name: "@ledgerly/recommended",
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { ledgerly: plugin },
    rules: {
      "ledgerly/no-primitive-colors": "error",
      "ledgerly/no-arbitrary-values": "error",
      "ledgerly/no-transition-all": "error",
      "ledgerly/typography": "error",
    },
  },
};

export default plugin;

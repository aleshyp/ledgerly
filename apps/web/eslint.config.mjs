import ledgerly from "@ledgerly/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ledgerly.configs.recommended,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "next/router", message: "Pages Router API. Use next/navigation." },
            { name: "next/head", message: "Pages Router API. Export `metadata` instead." },
            { name: "radix-ui", message: "Use the wrapped component from @ledgerly/ui." },
            { name: "class-variance-authority", message: "Variants belong in @ledgerly/ui." },
          ],
          patterns: [
            { group: ["@radix-ui/*"], message: "Use the wrapped component from @ledgerly/ui." },
            { group: ["@ledgerly/*/src/*"], message: "Import from the package entry point." },
          ],
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.property.name=/^(toFixed|toLocaleString|toLocaleDateString|toLocaleTimeString)$/]",
          message: "Format money, numbers and dates with the helpers in lib/format.ts.",
        },
        {
          selector: "NewExpression[callee.object.name='Intl']",
          message: "Add formatters to lib/format.ts so every screen formats values the same way.",
        },
        {
          selector:
            "JSXOpeningElement[name.name='a'] > JSXAttribute[name.name='href'] > Literal[value=/^\\x2F/]",
          message: "Use next/link for internal navigation.",
        },
      ],
    },
  },
  {
    files: ["lib/format.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
]);

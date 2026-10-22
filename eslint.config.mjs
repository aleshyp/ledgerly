// Shared lint config for packages/*. apps/web has its own config built on eslint-config-next.
import js from "@eslint/js";
import ledgerly from "@ledgerly/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["**/dist/**", "**/storybook-static/**", "**/.next/**", "apps/web/**"]),
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  storybook.configs["flat/recommended"],
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["packages/ui/**/*.{ts,tsx}"],
    extends: [jsxA11y.flatConfigs.recommended, ledgerly.configs.recommended],
  },
  {
    // Foundation stories render the raw scales on purpose.
    files: ["packages/ui/src/foundations/**"],
    rules: {
      "ledgerly/no-primitive-colors": "off",
      "ledgerly/no-arbitrary-values": "off",
    },
  },
  {
    files: ["packages/eslint-plugin/**/*.js"],
    languageOptions: { globals: { console: "readonly" } },
  },
]);

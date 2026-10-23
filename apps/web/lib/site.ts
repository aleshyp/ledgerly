/** Where the production build lives. Vercel sets this on every deployment. */
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://ledgerly-one-ashy.vercel.app";

export const siteName = "Ledgerly";
export const tagline = "The finance OS for growing businesses";
export const siteDescription =
  "Ledgerly brings banking, cards, invoicing and reporting into one calm workspace. A fictional product built as a design-system demo.";

export const repoUrl = "https://github.com/aleshyp/ledgerly";
/** Published from main by .github/workflows/storybook.yml. */
export const storybookUrl = "https://aleshyp.github.io/ledgerly/";

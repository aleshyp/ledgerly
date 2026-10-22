import type { Preview } from "@storybook/react-vite";
import { TooltipProvider } from "../src/components/tooltip";
import "./preview.css";

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.theme = context.globals.theme;
      return (
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      );
    },
  ],
  parameters: {
    layout: "centered",
    controls: { expanded: true, sort: "requiredFirst" },
    backgrounds: { disable: true },
    a11y: { test: "error" },
    options: {
      storySort: { order: ["Introduction", "Foundations", "Components", "Patterns"] },
    },
  },
};

export default preview;

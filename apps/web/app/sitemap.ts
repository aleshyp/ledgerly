import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const routes = [
  { path: "", priority: 1 },
  { path: "/pricing", priority: 0.8 },
  { path: "/dashboard", priority: 0.8 },
  { path: "/transactions", priority: 0.6 },
  { path: "/settings", priority: 0.4 },
  { path: "/contact", priority: 0.4 },
  { path: "/signup", priority: 0.4 },
  { path: "/login", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({ url: `${siteUrl}${path}`, priority }));
}

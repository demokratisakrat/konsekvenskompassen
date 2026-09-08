import type { Route } from "./+types/sitemap.xml";
import { PROFILES } from "../lib/profiles";

// Statiska sidor värda att indexera. /stats, /design och /api ligger medvetet utanför.
const PAGES: { path: string; changefreq: string; priority: string }[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/kompass", changefreq: "weekly", priority: "0.9" },
  { path: "/profiler", changefreq: "weekly", priority: "0.8" },
  { path: "/metodik", changefreq: "monthly", priority: "0.7" },
  { path: "/partimatchning", changefreq: "monthly", priority: "0.7" },
  { path: "/andringar", changefreq: "weekly", priority: "0.6" },
  { path: "/om", changefreq: "monthly", priority: "0.5" },
  { path: "/integritet", changefreq: "monthly", priority: "0.5" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const origin = new URL(request.url).origin;

  const entries = [
    ...PAGES.map((p) => ({ loc: origin + p.path, lastmod: undefined, ...p })),
    ...PROFILES.map((p) => ({
      loc: `${origin}/profiler/${p.slug}`,
      lastmod: p.updated,
      changefreq: "monthly",
      priority: "0.6",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${e.loc}</loc>\n` +
      (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : "") +
      `    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

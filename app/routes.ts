import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("kompass", "routes/kompass.tsx"),
  route("profiler", "routes/profiler.tsx"),
  route("profiler/:slug", "routes/profil.tsx"),
  route("metodik", "routes/metodik.tsx"),
  route("om", "routes/om.tsx"),
  route("integritet", "routes/integritet.tsx"),
  route("api/chat", "routes/api.chat.ts"),
  route("api/feedback", "routes/api.feedback.ts"),
  route("api/timing", "routes/api.timing.ts"),
  route("stats", "routes/stats.tsx"),
] satisfies RouteConfig;

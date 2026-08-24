import { createRequestHandler, RouterContextProvider } from "react-router";
import { cloudflareContext } from "../app/lib/cloudflare-context.server";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  fetch(request, env, ctx) {
    // Gamla domänen 301:ar till valsnack.se med path/query intakta.
    const url = new URL(request.url);
    if (url.hostname.endsWith("konsekvenskompassen.se")) {
      url.hostname = "valsnack.se";
      return Response.redirect(url.toString(), 301);
    }
    const routerContext = new RouterContextProvider();
    routerContext.set(cloudflareContext, { env, ctx });
    return requestHandler(request, routerContext);
  },
} satisfies ExportedHandler<Env>;

import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/mdx.tsx", [route("about", "routes/about.md")]),
] satisfies RouteConfig;

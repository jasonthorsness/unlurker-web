import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import FathomAnalytics from "./fathomAnalytics";

import type { Route } from "./+types/root";
import "./app.css";

export function loader() {
  return { fathomSiteId: process.env.FATHOM_SITE_ID };
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function meta() {
  return [
    { title: "Unlurker" },
    { name: "description", content: "Unlurker is a view of active discussions on Hacker News." },
    { property: "og:title", content: "Unlurker" },
    {
      property: "og:description",
      content: "Unlurker is a view of active discussions on Hacker News.",
    },
    { property: "og:url", content: "https://hn.unlurker.com" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://hn.unlurker.com/social-1200x630.jpg" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image", content: "https://hn.unlurker.com/social-1080x1350.jpg" },
    { property: "og:image:width", content: "1080" },
    { property: "og:image:height", content: "1350" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Unlurker" },
    {
      name: "twitter:description",
      content: "Unlurker is a view of active discussions on Hacker News.",
    },
    { name: "twitter:image", content: "https://hn.unlurker.com/social-1200x630.jpg" },
    { name: "twitter:url", content: "https://hn.unlurker.com" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  let { fathomSiteId } = useLoaderData<{ fathomSiteId: string }>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body id="top" className="max-w-7xl mx-auto p-0 sm:p-1 font-sans">
        {children}
        <div className="block h-[10vh]"></div>
        <FathomAnalytics siteID={fathomSiteId} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

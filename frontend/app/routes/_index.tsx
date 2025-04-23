import type { Route } from "./+types/_index";
import Controls from "./controls";
import { Fragment } from "react";
import { useEffect, useRef } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Unlurker" },
    { name: "description", content: "Welcome to Unlurker!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const sp = url.searchParams;
  const minBy = sp.get("min-by") ?? "3";
  const maxAge = sp.get("max-age") ?? "8h";
  const windowParam = sp.get("window") ?? "30m";

  const params = new URLSearchParams({
    "min-by": minBy,
    "max-age": maxAge,
    window: windowParam,
  }).toString();

  const res = await fetch(`http://${process.env.UNL_API}/active?${params}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  const data = (await res.json()) ?? [];

  return { data, minBy, maxAge, windowParam };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data, minBy, maxAge, windowParam } = loaderData;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (!containerRef.current) return;
      const items =
        containerRef.current.querySelectorAll<HTMLElement>(".truncate");
      items.forEach((item) => {
        const parent = item.parentElement;

        const cb = parent?.querySelector<HTMLInputElement>(
          "input[type=checkbox].peer"
        );

        if (item.scrollWidth > item.clientWidth) {
          parent?.setAttribute("data-truncated", "true");
        } else if (!cb?.checked) {
          parent?.removeAttribute("data-truncated");
        }
      });
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, []);

  return (
    <main>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 p-1">
        <a
          href="/"
          className="text-green-600 dark:text-green-500 font-bold text-xl mb-1 sm:mb-0"
        >
          Unlurker
        </a>
        <Controls minBy={minBy} maxAge={maxAge} windowParam={windowParam} />
      </div>

      <div
        ref={containerRef}
        className="grid grid-cols-[auto_1fr] pl-1 sm:pl-0 sm:grid-cols-[auto_auto_1fr] text-sm gap-x-[1ch] text-xs"
      >
        {data.map((item, idx) => {
          const link = `https://news.ycombinator.com/item?id=${item.id}`;
          const gapClass = item.root && idx !== 0 ? "mt-[2ch]" : "";
          const ageClass = item.active
            ? "text-blue-600 dark:text-blue-400 font-bold"
            : "text-blue-400 dark:text-blue-600 font-bold";
          const titleClass = item.root
            ? "text-green-600 dark:text-green-500 font-bold"
            : "";

          let indent = item.indent;
          if (indent !== "") {
            indent += "\\";
            if (item.text !== "") indent += "-";
          }

          const toggleId = `wrap-toggle-${item.id}`;

          return (
            <Fragment key={item.id}>
              <a
                href={link}
                target="unl"
                className={`text-right hidden sm:block ${gapClass}`}
              >
                {item.by}
              </a>
              <a
                href={link}
                target="unl"
                className={`text-right block font-mono ${ageClass} ${gapClass}`}
              >
                {item.age}
              </a>
              <div className={`flex items-start space-x-1 min-w-0 ${gapClass}`}>
                <input
                  type="checkbox"
                  id={toggleId}
                  className="peer sr-only hidden theme-midnight:block"
                />
                <a
                  href={link}
                  target="unl"
                  className={`
            truncate whitespace-nowrap block
            peer-checked:whitespace-normal peer-checked:break-words
            ${titleClass}
          `}
                >
                  <span className="font-mono whitespace-pre text-gray-400 dark:text-gray-600">
                    {indent}
                  </span>
                  <span>{item.text}</span>
                </a>
                <label
                  htmlFor={toggleId}
                  className="w-4 h-4 border rounded cursor-pointer hidden theme-midnight:block
                     peer-checked:bg-blue-500 peer-checked:border-transparent shrink-0"
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </main>
  );
}

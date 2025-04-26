import type { Route } from "./+types/home";
import Controls from "./controls";
import { Fragment } from "react";
import { useEffect, useRef } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Unlurker" }, { name: "description", content: "Welcome to Unlurker!" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const sp = url.searchParams;
  const minBy = sp.get("min-by") ?? "3";
  const maxAge = sp.get("max-age") ?? "8h";
  const windowParam = sp.get("window") ?? "30m";
  const user = sp.get("user") ?? "1";

  const params = new URLSearchParams({
    "min-by": minBy,
    "max-age": maxAge,
    window: windowParam,
    user,
  }).toString();

  const res = await fetch(`http://${process.env.UNL_API}/active?${params}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  const data = (await res.json()) ?? [];

  return { data, minBy, maxAge, windowParam, user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data, minBy, maxAge, windowParam, user } = loaderData;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (!containerRef.current) return;

      type Change = {
        parent: HTMLElement;
        truncated: boolean;
        checked: boolean;
      };

      const changes: Change[] = [];

      containerRef.current.querySelectorAll<HTMLElement>(".truncate").forEach((item) => {
        const parent = item.parentElement!;
        const cb = parent.firstElementChild as HTMLInputElement;
        const needsTrunc = item.scrollWidth > item.clientWidth;
        changes.push({ parent, truncated: needsTrunc, checked: cb?.checked });
      });

      window.requestAnimationFrame(() => {
        changes.forEach(({ parent, truncated, checked }) => {
          if (checked || truncated) {
            parent.setAttribute("data-truncated", "true");
          } else if (!checked) {
            parent.removeAttribute("data-truncated");
          }
        });
      });
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, []);

  return (
    <main>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 p-1">
        <div className="flex items-center space-x-2 ">
          <a
            href="/"
            className="text-green-600 dark:text-green-500 font-bold text-xl mb-1 sm:mb-0 hover:underline"
          >
            Unlurker
          </a>
          <span className="text-green-600 dark:text-green-500 font-bold text-xl mb-1 sm:mb-0 aria-hidden">
            |
          </span>
          <a
            href="/about"
            className="text-green-600 dark:text-green-500 font-bold text-xl mb-1 sm:mb-0 hover:underline"
          >
            About
          </a>
        </div>
        <Controls minBy={minBy} maxAge={maxAge} windowParam={windowParam} user={user} />
      </div>

      <div
        ref={containerRef}
        className={`
          grid grid-cols-[auto_1fr] pl-1 sm:pl-0
          ${user === "1" ? "sm:grid-cols-[auto_auto_1fr]" : ""}
          text-sm gap-x-[1ch] text-xs sm:text-base
        `}
      >
        {data.map((item: any, idx: number) => {
          const link = `https://news.ycombinator.com/item?id=${item.id}`;
          const gapClass = item.root && idx !== 0 ? "mt-[2ch]" : "";
          const ageClass = item.active
            ? "text-blue-600 dark:text-blue-400 font-bold"
            : "text-blue-400 dark:text-blue-600 font-bold";
          const titleClass = item.root ? "text-green-600 dark:text-green-500 font-bold" : "";

          let indent = item.indent;
          if (indent !== "") {
            indent += "\\";
            if (item.text !== "") indent += "-";
          }

          const toggleId = `wrap-toggle-${item.id}`;

          return (
            <Fragment key={item.id}>
              {user === "1" && (
                <a
                  href={`https://news.ycombinator.com/user?id=${item.by}`}
                  aria-label={`Open user page for ${item.by}`}
                  className={`text-right hidden sm:block ${gapClass}`}
                >
                  {item.by}
                </a>
              )}
              <a
                href={link}
                aria-label={`Open item on news.ycombinator.com`}
                className={`text-right block font-mono ${ageClass} ${gapClass}`}
              >
                <span className="sm:hidden">{item.active ? "•" : ""}</span>
                <span className="hidden sm:inline" style={{ whiteSpace: "pre" }}>
                  {item.age}
                </span>
              </a>
              <div className={`flex items-start space-x-1 min-w-0 ${gapClass}`}>
                <input
                  type="checkbox"
                  id={toggleId}
                  aria-label="expanded"
                  className="peer sr-only invisible truncated:visible"
                />
                <a
                  href={link}
                  aria-label={`Open item on news.ycombinator.com`}
                  data-toggle-id={toggleId}
                  className={`
            truncate whitespace-nowrap block
            peer-checked:whitespace-normal peer-checked:break-words
            ${titleClass}
          `}
                >
                  <span
                    className="font-mono whitespace-pre text-gray-400 dark:text-gray-600"
                    aria-hidden
                  >
                    {indent}
                  </span>
                  <span>{item.text}</span>
                </a>
                <label
                  htmlFor={toggleId}
                  aria-label="expand/collapse"
                  className="relative inline-block w-10 h-4 -ml-6 cursor-pointer shrink-0 invisible truncated:visible text-gray-400 dark:text-gray-600
                  before:content-['▼']
                  before:absolute before:inset-0
                  before:flex before:items-center before:justify-end before:pr-1
                  peer-checked:before:content-['▲']"
                ></label>
              </div>
            </Fragment>
          );
        })}
      </div>
    </main>
  );
}

// app/routes/index.tsx
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import Controls from "./controls";

interface Item {
  id: number;
  by: string;
  age: string;
  text: string;
  indent: string;
  root: boolean;
  active: boolean;
}

interface LoaderData {
  data: Item[];
  minBy: string;
  maxAge: string;
  windowParam: string;
}

export const loader: LoaderFunction = async ({ request }) => {
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

  return json<LoaderData>({ data, minBy, maxAge, windowParam });
};

export default function Index() {
  const { data, minBy, maxAge, windowParam } = useLoaderData<LoaderData>();

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

      <div className="grid grid-cols-[auto_1fr] pl-1 sm:pl-0 sm:grid-cols-[auto_auto_1fr] text-sm gap-x-[1ch] text-xs">
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
              <a
                href={link}
                target="unl"
                className={`truncate text-left block ${titleClass} ${gapClass}`}
              >
                <span className="font-mono whitespace-pre text-gray-400 dark:text-gray-600">
                  {indent}
                </span>
                {item.text}
              </a>
            </Fragment>
          );
        })}
      </div>
    </main>
  );
}

import React, { Fragment } from "react";
import Link from "next/link";
import Controls from "./controls";

interface SearchParams {
  "min-by"?: string;
  "max-age"?: string;
  window?: string;
}

export const metadata = {
  title: "Unlurker",
  description:
    "Unlurker helps you find the liveliest discussions on news.ycombinator.com so you can jump in before discussion dies.",
};

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const minBy = sp["min-by"] || "3";
  const maxAge = sp["max-age"] || "8h";
  const windowParam = sp.window || "30m";

  const params = new URLSearchParams({
    "min-by": minBy,
    "max-age": maxAge,
    window: windowParam,
  }).toString();

  const url = `http://${process.env["UNL_API"]}/active?${params}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  let data: any[] = await res.json();
  if (data == null) {
    data = [];
  }

  return (
    <main className="font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 p-1">
        <Link
          href="/"
          className="text-green-600 dark:text-green-500 font-bold text-xl mb-1 sm:mb-0"
        >
          Unlurker
        </Link>
        <Controls minBy={minBy} maxAge={maxAge} windowParam={windowParam} />
      </div>

      <div className="grid grid-cols-[auto_1fr] pl-1 sm:pl-0 sm:grid-cols-[auto_auto_1fr] text-sm gap-x-[1ch] text-xs">
        {data.map((item, idx) => {
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

          return (
            <Fragment key={item.id}>
              <a href={link} target="unl" className={`text-right hidden sm:block ${gapClass}`}>
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

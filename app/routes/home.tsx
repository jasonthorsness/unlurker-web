import type { Route } from "./+types/home";
import Controls from "./controls";
import Nav from "./nav";
import { calculateIndents } from "./indent";
import { memo, useRef } from "react";
import Age from "./age";
import Text from "./text";
import { useTruncator } from "./useTruncator";
import DoubleChevron from "../doubleChevron";

interface RawItem {
  by: string;
  text: string;
  age: string;
  id: number;
  depth: number;
  active: boolean;
}

export async function loader({ request }: Route.LoaderArgs) {
  const sp = new URL(request.url).searchParams;
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

  const res = await fetch(`${process.env.UNL_API}/active?${params}`);
  if (!res.ok) throw new Error("Failed to fetch data");
  const rawData = ((await res.json()) ?? []) as RawItem[];

  const indents = calculateIndents(rawData);
  const data = rawData.map((i, idx) => ({
    by: i.by,
    text: i.text,
    id: i.id,
    active: i.active,
    age: i.age,
    root: i.depth === 0,
    indent: indents[idx],
  }));

  return { data, minBy, maxAge, windowParam, user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data, minBy, maxAge, windowParam, user } = loaderData;

  const containerRef = useRef<HTMLDivElement>(null);
  useTruncator(containerRef);

  return (
    <>
      <main>
        <Nav>
          <Controls minBy={minBy} maxAge={maxAge} windowParam={windowParam} user={user} />
        </Nav>

        <div
          ref={containerRef}
          className={`
          grid grid-cols-[auto_1fr] pl-1 sm:pl-0
          ${user === "1" ? "sm:grid-cols-[auto_auto_1fr]" : ""}
          text-sm gap-x-[1ch] text-xs sm:text-base
        `}
        >
          {data.map((item, idx) => {
            return (
              <ListItem
                key={item.id}
                {...item}
                gapClass={item.root && idx !== 0 ? "mt-[2ch]" : ""}
                user={user === "1"}
              />
            );
          })}
        </div>
      </main>
      <div className="text-center pt-8">
        <a href="#top">
          <DoubleChevron />
          <span>&nbsp;Top&nbsp;</span>
          <DoubleChevron />
        </a>
      </div>
    </>
  );
}

type ListItemProps = {
  id: number;
  by: string;
  age: string;
  indent: string;
  text: string;
  active: boolean;
  root: boolean;
  gapClass: string;
  user: boolean;
};

const ListItem = memo(function ListItem({
  id,
  by,
  age,
  indent,
  text,
  active,
  root,
  gapClass,
  user,
}: ListItemProps) {
  return (
    <>
      {user && (
        <a
          href={`https://news.ycombinator.com/user?id=${by}`}
          aria-label={`Open user page for ${by}`}
          className={`hidden sm:block text-right whitespace-nowrap ${gapClass}`}
        >
          {by}
        </a>
      )}
      <Age
        link={`https://news.ycombinator.com/item?id=${id}`}
        active={active}
        age={age}
        className={gapClass}
      />
      <Text
        link={`https://news.ycombinator.com/item?id=${id}`}
        toggleId={`wrap-toggle-${id}`}
        indent={indent}
        text={text}
        className={gapClass}
        root={root}
      />
    </>
  );
});

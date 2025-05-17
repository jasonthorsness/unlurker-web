import type { Route } from "./+types/replay";
import Nav from "./nav";
import { calculateIndents } from "./indent";
import { useRef, useEffect, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTruncator } from "./useTruncator";
import Age from "./age";
import By from "./by";
import Text from "./text";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  PlayIcon,
  PauseIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";

interface RawItem {
  by: string;
  text: string;
  time: number;
  id: number;
  depth: number;
}

const suggestedStories = [
  { id: 8863, text: "My YC app: Dropbox - Throw away your USB drive" },
  { id: 3053883, text: "Stripe: instant payment processing for developers" },
  { id: 5789055, text: "React, a JavaScript library for building user interfaces" },
  { id: 8624160, text: "Launching in 2015: A Certificate Authority to Encrypt the Entire Web" },
  { id: 33804874, text: "OpenAI ChatGPT: Optimizing language models for dialogue" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const ua = request.headers.get("user-agent") ?? "";
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(ua);

  const sp = new URL(request.url).searchParams;
  const item = sp.get("item") ?? String(suggestedStories[0].id);

  const res = await fetch(`${process.env.UNL_API}/item/${item}/tree`);
  if (!res.ok) throw new Error("Failed to fetch data");
  const data = ((await res.json()) ?? []) as RawItem[];

  const longestByLength = data.reduce((acc, a) => (a?.by?.length > acc ? a?.by?.length : acc), 0);

  return { data, item, isMobile, longestByLength };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data, item: defaultItem, isMobile, longestByLength } = loaderData;
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isJogging, setIsJogging] = useState(false);

  var defaultWindow: number;

  if (data.length >= 450) {
    defaultWindow = 5;
  } else if (data.length >= 250) {
    defaultWindow = 15;
  } else {
    defaultWindow = 30;
  }

  const [windowMinutes, setWindowMinutes] = useState(defaultWindow);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [user, setUser] = useState(isMobile ? "0" : "1");
  const [query, setQuery] = useState("");
  const [item, setItem] = useState<string | null>(defaultItem);

  const frames = useMemo(() => buildFrames(data, windowMinutes), [data, windowMinutes]);

  if (currentFrame >= frames.length) {
    setCurrentFrame(frames.length - 1);
  }

  useEffect(() => {
    if (isJogging || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 500 / speedMultiplier);
    return () => clearInterval(interval);
  }, [frames.length, isPlaying, isJogging, speedMultiplier]);

  const handleFirst = () => setCurrentFrame(0);
  const handlePrev = () => setCurrentFrame(Math.max(0, currentFrame - 1));
  const handleNext = () => setCurrentFrame(Math.min(frames.length - 1, currentFrame + 1));
  const handleLast = () => setCurrentFrame(frames.length - 1);

  const containerRef = useRef<HTMLDivElement>(null);
  const checkTruncation = useTruncator(containerRef);

  useEffect(() => {
    checkTruncation();
  }, [currentFrame, checkTruncation]);

  useEffect(() => {
    const onUp = () => setIsJogging(false);
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, []);

  return (
    <main>
      <Nav>
        <div className="flex flex-col sm:flex-row sm:justify-between space-x-4">
          <div className="flex flex-nowrap justify-between w-full sm:w-auto order-3 sm:order-1 space-x-2">
            <button
              onClick={handleFirst}
              aria-label="First frame"
              className="p-2 border border-transparent hover:border-black hover:dark:border-white"
            >
              <ChevronDoubleLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handlePrev}
              aria-label="Previous frame"
              className="p-2 border border-transparent hover:border-black hover:dark:border-white"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="p-2 border border-transparent hover:border-black hover:dark:border-white"
            >
              {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            </button>
            <button
              onClick={handleNext}
              aria-label="Next frame"
              className="p-2 border border-transparent hover:border-black hover:dark:border-white"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleLast}
              aria-label="Last frame"
              className="p-2 border border-transparent hover:border-black hover:dark:border-white"
            >
              <ChevronDoubleRightIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-[1fr_auto] sm:flex sm:flex-nowrap items-center sm:w-auto order-2 sm:order-2 space-x-2 pt-2 sm:pt-0">
            <input
              type="range"
              aria-label="frame jogger"
              min={0}
              max={frames.length - 1}
              value={currentFrame}
              onChange={(e) => setCurrentFrame(Number(e.currentTarget.value))}
              onPointerDown={() => setIsJogging(true)}
              className="sm:w-48"
            />
            <span className="text-sm w-[10ch]">
              {currentFrame + 1} / {frames.length}
            </span>
          </div>
          <div className="flex flex-nowrap items-center w-full sm:w-auto order-1 sm:order-3 space-x-2">
            <Combobox
              value={item}
              onChange={(v) => {
                if (v) {
                  setItem(v);
                  window.location.href = `/replay?item=${v}`;
                }
              }}
            >
              <div className="relative">
                <ComboboxInput
                  onChange={(event) => setQuery(event.target.value)}
                  autoComplete="off"
                  aria-label="item"
                  className="w-[12ch] px-1 border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black placeholder-white"
                />
                <ComboboxButton
                  aria-label="suggested items"
                  className="absolute inset-y-0 right-0 flex items-center px-2"
                >
                  <ChevronDownIcon className="h-[12px] w-[12px]" aria-hidden="true" />
                </ComboboxButton>
              </div>
              <ComboboxOptions
                anchor="bottom"
                className="border border-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible bg-black"
              >
                {query != "" && (
                  <ComboboxOption
                    key={0}
                    value={query}
                    className="group flex cursor-default items-center gap-2 px-3 py-1.5 select-none data-focus:bg-white/10"
                  >
                    {query}
                  </ComboboxOption>
                )}
                {suggestedStories
                  .filter((z) => String(z.id) != item)
                  .map((item) => (
                    <ComboboxOption
                      key={item.id}
                      value={String(item.id)}
                      className="group flex cursor-default items-center gap-2 px-3 py-1.5 select-none data-focus:bg-white/10"
                    >
                      {item.id} {item.text}
                    </ComboboxOption>
                  ))}
              </ComboboxOptions>
            </Combobox>
            <select
              aria-label="speed"
              value={`${speedMultiplier}x`}
              onChange={(e) => {
                const v = parseFloat(e.currentTarget.value.replace("x", ""));
                setSpeedMultiplier(v);
              }}
              className="border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black"
            >
              {["0.5x", "1x", "2x", "4x"].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <select
              aria-label="window"
              value={`${windowMinutes}m`}
              onChange={(e) => {
                // e.g. "15m" → 15
                const minutes = parseInt(e.currentTarget.value.replace("m", ""), 10);
                setWindowMinutes(minutes);
              }}
              className="border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black"
            >
              {["5m", "10m", "15m", "30m", "45m", "60m", "90m", "120m"].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <label className="flex items-center space-x-2 text-black dark:text-white hidden sm:flex">
              <span>user</span>
              <input
                type="checkbox"
                id="user"
                name="user"
                checked={user === "1"}
                onChange={(e) => setUser(e.target.checked ? "1" : "0")}
                className="w-4 h-4 border border-black dark:border-white bg-white dark:bg-black"
              />
            </label>
          </div>
        </div>
      </Nav>

      <div
        ref={containerRef}
        className={`
          grid grid-cols-1 pl-1 sm:pl-0
          ${user === "1" ? "sm:grid-cols-1" : ""}
          text-sm gap-x-[1ch] text-xs sm:text-base
        `}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {frames[currentFrame >= frames.length ? frames.length - 1 : currentFrame].map(
            (item: any, idx: number) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 0 }}
                transition={{ duration: isJogging ? 0 : 0.2 / speedMultiplier }}
                className={`
                grid grid-cols-[auto_1fr] pl-1 sm:pl-0
                ${user === "1" ? "sm:grid-cols-[auto_auto_1fr]" : ""}
                text-sm gap-x-[1ch] text-xs sm:text-base
              `}
              >
                <ListItem
                  user={user === "1"}
                  {...item}
                  idx={idx}
                  longestByLength={longestByLength}
                />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

type ListItemProps = {
  user: boolean;
  by: string;
  text: string;
  id: number;
  active: boolean;
  age: string;
  root: boolean;
  indent: string;
  idx: number;
  longestByLength: number;
};

function ListItem({
  user,
  by,
  text,
  id,
  active,
  age,
  root,
  indent,
  idx,
  longestByLength,
}: ListItemProps) {
  const gapClass = root && idx !== 0 ? "mt-[2ch]" : "";
  const toggleId = `wrap-toggle-${id}`;
  return (
    <>
      {user && (
        <div style={{ width: `${longestByLength}ch` }}>
          <By by={by} className={`${gapClass}`} />
        </div>
      )}
      <Age
        link={`https://news.ycombinator.com/item?id=${id}`}
        active={active}
        age={age}
        className={`w-[1ch] sm:w-[8ch] ${gapClass}`}
      />
      <Text
        link={`https://news.ycombinator.com/item?id=${id}`}
        toggleId={toggleId}
        indent={indent}
        text={text}
        className={gapClass}
        root={root}
      />
    </>
  );
}

function buildFrames(data: RawItem[], windowMinutes: number) {
  const windowSecondsInclusive = windowMinutes * 60;

  // round all the times to the nearest minute
  data.forEach((item) => {
    item.time = Math.ceil(item.time / 60) * 60;
  });

  const initialTimesSet = new Set<number>();

  // add frames at entry and exit of each item
  data.forEach((item, idx) => {
    initialTimesSet.add(item.time);
    if (idx != 0) {
      initialTimesSet.add(item.time + windowSecondsInclusive);
    }
  });

  // sort the frames and add one final frame at the end
  const initialTimes = Array.from(initialTimesSet).sort((a, b) => a - b);
  initialTimes.push(initialTimes[initialTimes.length - 1] + 60);

  // seed the frames with items created before the frame time
  const initialFrames = initialTimes.map((time) => data.filter((item) => item.time <= time));

  // track the last frame each item appears in
  const lastInitialShownTime = new Map<number, number>();
  lastInitialShownTime.set(data[0].id, initialTimes[initialTimes.length - 1]);

  for (let i = 0; i < initialFrames.length; i++) {
    let prevActiveTree = false;
    let prevDepth = 0;

    for (let j = initialFrames[i].length - 1; j >= 0; j--) {
      let time = initialTimes[i];
      let item = initialFrames[i][j];

      const active = j == 0 || time - Math.ceil(item.time / 60) * 60 <= windowSecondsInclusive;

      if (active) {
        // OK (leaf)
      } else if (prevDepth > item.depth && prevActiveTree) {
        // OK (ancestor)
      } else {
        // DELETE from this frame; can't reach active leaf through this item
        // Setting null! as these are filtered out immediately after the loop
        initialFrames[i][j] = null!;

        if (!lastInitialShownTime.has(item.id)) {
          lastInitialShownTime.set(item.id, initialTimes[i - 1]);
        }

        continue;
      }

      prevActiveTree = prevActiveTree || active;
      prevDepth = item.depth;
    }

    initialFrames[i] = initialFrames[i].filter((item: any) => item !== null);
  }

  const shownCounts = new Map<number, number>();
  const minShownCount = 5;

  const finalTimes: typeof initialTimes = [];

  // we do another pass and duplicate times (repeat) if an item doesn't have a high-enough count on its lastInitialShownTime
  for (let i = 0; i < initialFrames.length; i++) {
    let repeat = false;
    // start at 1 as we don't ever need to extend it
    for (let j = 1; j < initialFrames[i].length; j++) {
      let item = initialFrames[i][j];
      shownCounts.set(item!.id, (shownCounts.get(item!.id) ?? 0) + 1);
      if (initialTimes[i] == lastInitialShownTime.get(item!.id)) {
        if (shownCounts.get(item!.id)! < minShownCount) {
          repeat = true;
        }
      }
    }

    finalTimes.push(initialTimes[i]);

    if (repeat) {
      i--;
    }
  }

  // might end up with multiple frames at the same time
  // [1, 5, 6, 6, 6, 7 ]
  // spread them out so it never appears hung like
  // [1, 3, 4, 5, 6, 7]
  // this works as long as minShownCount is smaller than the window in minutes
  let times = fixDuplicates(finalTimes);

  // Create the real frames
  const frames = times.map((time) =>
    data
      .filter((item: any) => item.time <= time)
      .map((item: any, idx: any) => ({
        by: item.by,
        depth: item.depth,
        text: item.text,
        id: item.id,
        time: item.time,
        indent: "",
        root: item.depth === 0,
        age: prettyFormatDuration(time - item.time < 0 ? 0 : time - item.time),
        active: time - item.time <= windowSecondsInclusive,
      }))
  );

  // Complete the frames
  for (let i = 0; i < frames.length; i++) {
    let prevActiveTree = false;
    let prevActive = false;
    let prevDepth = 0;

    for (let j = frames[i].length - 1; j >= 0; j--) {
      let item = frames[i][j];

      if (item.active) {
        // OK
      } else if ((prevDepth > item.depth && prevActive) || item.depth == 0) {
        // OK
      } else if (prevDepth > item.depth && prevActiveTree) {
        item.text = undefined;
      } else {
        // DELETE from this frame; can't reach active leaf through this item
        // Setting null! as these are filtered out immediately after the loop
        frames[i][j] = null!;
        continue;
      }

      prevActiveTree = prevActiveTree || item.active;
      prevActive = item.active;
      prevDepth = item.depth;
    }

    frames[i] = frames[i].filter((item: any) => item !== null);

    const indent = calculateIndents(frames[i]);
    for (let j = 0; j < frames[i].length; j++) {
      frames[i][j].indent = indent[j];
    }
  }

  return frames;
}

function prettyFormatDuration(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes}m`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const pad = minutes < 10 ? "h  " : "h ";
  return `${hours}${pad}${minutes}m`;
}

function fixDuplicates(input: number[]): number[] {
  const arr = [...input].sort((a, b) => a - b);
  let changed;
  do {
    changed = false;
    let last = undefined;
    let counter = 0;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i] === last) {
        counter += 60;
        arr[i] -= counter;
        changed = true;
      } else {
        counter = 0;
        last = arr[i];
      }
    }
    arr.sort((a, b) => a - b);
  } while (changed);
  return arr;
}

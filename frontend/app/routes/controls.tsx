interface ControlsProps {
  minBy: string;
  maxAge: string;
  windowParam: string;
}

export default function Controls({
  minBy,
  maxAge,
  windowParam,
}: ControlsProps) {
  return (
    <form method="get" className="flex flex-wrap gap-2 sm:gap-4 text-xs">
      <label className="flex items-center space-x-2 text-black dark:text-white">
        <span>min-by</span>
        <select
          name="min-by"
          defaultValue={minBy}
          onChange={() => document.forms[0].submit()}
          className="border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black text-black dark:text-white"
        >
          {Array.from({ length: 10 }, (_, i) => `${i + 1}`).map((val) => (
            <option
              key={val}
              value={val}
              className="bg-white dark:bg-black text-black dark:text-white"
            >
              {val}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center space-x-2">
        <span>max-age</span>
        <select
          name="max-age"
          defaultValue={maxAge}
          onChange={() => document.forms[0].submit()}
          className="border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black text-black dark:text-white"
        >
          {[
            "1h",
            "2h",
            "3h",
            "4h",
            "6h",
            "8h",
            "12h",
            "18h",
            "24h",
            "36h",
            "48h",
            "72h",
          ].map((val) => (
            <option
              key={val}
              value={val}
              className="bg-white dark:bg-black text-black dark:text-white"
            >
              {val}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center space-x-2">
        <span>window</span>
        <select
          name="window"
          defaultValue={windowParam}
          onChange={() => document.forms[0].submit()}
          className="border border-black dark:border-white text-black dark:text-white bg-white dark:bg-black text-black dark:text-white"
        >
          {["5m", "10m", "15m", "30m", "45m", "60m", "90m", "120m"].map(
            (val) => (
              <option
                key={val}
                value={val}
                className="bg-white dark:bg-black text-black dark:text-white"
              >
                {val}
              </option>
            )
          )}
        </select>
      </label>
    </form>
  );
}

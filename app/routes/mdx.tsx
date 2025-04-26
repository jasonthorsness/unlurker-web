import { Outlet } from "react-router";

export default function MdxLayout() {
  return (
    <main>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 p-1">
        <div className="flex items-center space-x-2 ">
          <a href="/" className="text-green-600 dark:text-green-500 font-bold text-xl mb-1 sm:mb-0">
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
      </div>
      <div className="p-1 prose dark:prose-invert max-w-5xl">
        <Outlet />
      </div>
    </main>
  );
}

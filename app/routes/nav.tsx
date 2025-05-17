import React from "react";

interface NavProps {
  children?: React.ReactNode;
}

const Nav: React.FC<NavProps> = ({ children }) => {
  return (
    <div className="flex flex-wrap flex-col w-full space-y-2 sm:flex-row sm:items-center justify-between mb-2 p-1">
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
          href="/replay"
          className="text-green-600 dark:text-green-500 font-bold text-xl mb-1 sm:mb-0 hover:underline"
        >
          Replay
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
      <div>{children}</div>
    </div>
  );
};

export default Nav;

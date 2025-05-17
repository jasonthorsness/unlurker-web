import React from "react";

interface AgeProps {
  link: string;
  className?: string;
  active: boolean;
  age: string;
}

const Component: React.FC<AgeProps> = ({ link, active, age, className = "" }) => {
  const ageClass = active
    ? "text-blue-600 dark:text-blue-400 font-bold"
    : "text-blue-400 dark:text-blue-600 font-bold";
  return (
    <a
      href={link}
      aria-label="Open item on news.ycombinator.com"
      className={`text-right block font-mono ${ageClass} ${className}`}
    >
      <span className="sm:hidden">{active ? "•" : ""}</span>
      <span className="hidden sm:inline" style={{ whiteSpace: "pre" }}>
        {age}
      </span>
    </a>
  );
};

export default Component;

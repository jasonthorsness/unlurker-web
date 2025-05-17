import React from "react";

interface ByLinkProps {
  by: string;
  className?: string; // Optional prop
}

const Component: React.FC<ByLinkProps> = ({ by, className = "" }) => {
  return (
    <a
      href={`https://news.ycombinator.com/user?id=${by}`}
      aria-label={`Open user page for ${by}`}
      className={`hidden sm:block relative overflow-visible whitespace-nowrap ${className}`}
    >
      <span className="absolute right-0">{by}</span>
    </a>
  );
};

export default Component;

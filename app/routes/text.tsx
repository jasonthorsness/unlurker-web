import React from "react";

interface TextProps {
  link: string;
  toggleId: string;
  indent: string;
  text: string;
  className?: string;
  root: boolean;
}

const Text: React.FC<TextProps> = ({ link, toggleId, indent, text, root, className = "" }) => {
  const titleClassName = root ? "text-green-600 dark:text-green-500 font-bold" : "";
  return (
    <div className={`flex items-start space-x-1 min-w-0 ${className}`}>
      <input
        type="checkbox"
        id={toggleId}
        aria-label="expanded"
        className="peer sr-only invisible truncated:visible"
      />
      <a
        href={link}
        aria-label="Open item on news.ycombinator.com"
        data-toggle-id={toggleId}
        className={`
                        truncate whitespace-nowrap block
                        peer-checked:whitespace-normal peer-checked:break-words
                        ${titleClassName}
                    `}
      >
        <span className="font-mono whitespace-pre text-gray-400 dark:text-gray-600" aria-hidden>
          {indent}
        </span>
        <div className="inline-block w-[2px]" />
        <span>{text}</span>
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
  );
};

export default Text;

import { useEffect, type RefObject } from "react";

type Change = {
  parent: HTMLElement;
  truncated: boolean;
  checked: boolean;
};

export function useTruncator(containerRef: RefObject<HTMLElement | null>) {
  const checkTruncation = () => {
    const container = containerRef.current;
    if (!container) return;

    const changes: Change[] = [];
    container.querySelectorAll<HTMLElement>(".truncate").forEach((item) => {
      const parent = item.parentElement!;
      const cb = parent.firstElementChild as HTMLInputElement | null;
      const truncated = item.scrollWidth > item.clientWidth;
      changes.push({ parent, truncated, checked: cb?.checked ?? false });
    });

    window.requestAnimationFrame(() => {
      changes.forEach(({ parent, truncated, checked }) => {
        if (truncated || checked) {
          parent.setAttribute("data-truncated", "true");
        } else {
          parent.removeAttribute("data-truncated");
        }
      });
    });
  };

  useEffect(() => {
    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [containerRef]);

  return checkTruncation;
}

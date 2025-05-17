export function calculateIndents(
  items: {
    depth: number;
    text?: string;
  }[]
): string[] {
  const stack = [];

  const indents: string[] = Array(items.length);
  indents[0] = "";

  let lastDepth = 0;
  for (let i = items.length - 1; i > 0; i--) {
    const d = items[i].depth;
    if (d < lastDepth) {
      stack.pop();
    } else {
      if (stack.length > 0 && i < items.length - 1) {
        stack.pop();
        stack.push("|");
      }
      for (let k = 0; k < d - lastDepth; k++) {
        stack.push(" ");
      }
    }

    let indent = stack.join("");
    if (indent !== "") {
      indent += "\\";
      if (items[i].text !== undefined) indent += "-";
    }
    indents[i] = indent;

    lastDepth = d;
  }
  return indents;
}

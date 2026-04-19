// Diff primitive — the signature design language.
// Renders +chose / −rejected rows in monospace. Used everywhere
// a decision (project, belief, navigation) is being shown.
//
// Implementation: flexbox row where the marker is a fixed-width
// pseudo-element and all children flow inside a single body span.
// This keeps any number of inline children (text, multiple spans,
// links) flowing naturally instead of being treated as grid cells.

import type { ReactNode } from "react";

interface DiffRowProps {
  type: "add" | "remove" | "meta";
  children: ReactNode;
  className?: string;
}

export function DiffRow({ type, children, className = "" }: DiffRowProps) {
  return (
    <div className={`diff diff-${type} ${className}`}>
      <span className="diff-body">{children}</span>
    </div>
  );
}

interface DiffPairProps {
  add: ReactNode;
  remove: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function DiffPair({ add, remove, meta, className = "" }: DiffPairProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <DiffRow type="add">{add}</DiffRow>
      <DiffRow type="remove">{remove}</DiffRow>
      {meta && <DiffRow type="meta">{meta}</DiffRow>}
    </div>
  );
}

interface DiffStackProps {
  items: { add: ReactNode; remove: ReactNode; meta?: ReactNode }[];
  className?: string;
}

export function DiffStack({ items, className = "" }: DiffStackProps) {
  return (
    <div className={`space-y-5 ${className}`}>
      {items.map((item, i) => (
        <DiffPair
          key={i}
          add={item.add}
          remove={item.remove}
          meta={item.meta}
        />
      ))}
    </div>
  );
}

import { CSSProperties, ReactNode } from "react";

export default function PlayGrid({
  columns,
  rows,
  children,
}: {
  columns: number;
  rows: number;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto" style={{ "--rows": rows, "--columns": columns, "--size": "128px" } as CSSProperties}>
      {children}
      <style jsx>
        {`
          div {
            display: grid;
            grid-template-columns: repeat(var(--columns), var(--size));
            grid-template-rows: repeat(var(--rows), var(--size));
          }
        `}
      </style>
    </div>
  );
}

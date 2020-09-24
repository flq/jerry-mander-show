import { CSSProperties, ReactNode, useMemo } from "react";
import VotingUnit from "./VotingUnit";

export default function PlayGrid({ distribution }: { distribution: string[] }) {
  const [isValid, rows, columns, voteUnits] = useMemo(
    (() => {
      if (distribution[0].length !== distribution.length) return [false];
      const size = distribution.length;
      if (distribution.some((row) => row.length !== size)) return [false];
      const nodes = distribution.flatMap((row, rIndex) =>
        row
          .split("")
          .map((unit, colIndex) => (
            <VotingUnit
              key={`${rIndex}-${colIndex}`}
              tribe={unit === "1" ? "BLUE" : "RED"}
            />
          ))
      );
      return [true, size, size, nodes];
    }) as () => [false] | [true, number, number, ReactNode[]],
    [distribution]
  );

  return isValid ? (
    <div
      className="mx-auto"
      style={
        {
          "--rows": rows,
          "--columns": columns,
          "--size": "128px",
        } as CSSProperties
      }
    >
      {voteUnits}
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
  ) : (
    <h3>This distribution is not valid</h3>
  );
}

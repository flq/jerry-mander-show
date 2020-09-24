import { CSSProperties, ReactNode, useMemo } from "react";
import classnames from "classnames";
import VotingUnit from "./VotingUnit";
import { validateInitialDistribution } from "infrastructure/Game";

export default function PlayGrid({ distribution, className }: { distribution: string[]; className?: string }) {
  const [isValid, rows, columns, voteUnits] = useMemo(
    (() => {
      const size = validateInitialDistribution(distribution);
      if (isNaN(size)) return [false];
      
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
      className={classnames("mx-auto", className)}
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

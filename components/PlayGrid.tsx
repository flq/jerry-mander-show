import { CSSProperties } from "react";
import classnames from "classnames";
import { Game } from "infrastructure/Game";
import { useGame } from "./useGame";
import VotingUnit from "./VotingUnit";
import { DistrictView } from "./DistrictView";

export default function PlayGrid({
  distribution,
  districtSize,
  className,
}: {
  distribution: string[];
  districtSize: number;
  className?: string;
}) {
  const {
    constituents,
    districts,
    currentDistrict,
    parameters: { rows, columns },
    commands: { click, selectDistrict, resetGame },
  } = useGame(() => new Game(distribution, districtSize));

  return (
    <>
      <ul className="mx-auto flex items-stretch">
        {districts.map((d, i) => (
          <DistrictView
            key={i}
            index={i}
            district={d}
            isActive={d === currentDistrict}
            onClick={selectDistrict}
          />
        ))}
      </ul>
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
        {constituents.map(([key, constituent]) => (
          <VotingUnit
            key={key}
            constituent={constituent}
            borders={constituent.borders}
            districtResult={constituent.district?.result ?? null}
            districtState={constituent.district?.state ?? null}
            belongsToCurrentDistrict={constituent.district === currentDistrict}
            onClick={click}
          />
        ))}
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
      <button className="mx-auto mt-2 font-bold focus:outline-none" onClick={resetGame}>Reset Game</button>
    </>
  );
}

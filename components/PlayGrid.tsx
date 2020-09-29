import { CSSProperties } from "react";
import classnames from "classnames";
import VotingUnit from "./VotingUnit";
import { Game } from "infrastructure/Game";
import { useGame } from "./useGame";

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
    commands: { click, selectDistrict },
  } = useGame(() => new Game(distribution, districtSize));

  return (
    <>
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
    <ul className="w-auto flex flex-col items-stretch">
      {districts.map((d,i) => <button className={classnames("m-2", { "font-bold": d === currentDistrict })} onClick={() => selectDistrict(i)}>District {i+1}</button> )}
      </ul>
    </>
  );
}

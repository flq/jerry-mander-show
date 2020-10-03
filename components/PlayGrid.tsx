import { CSSProperties } from "react";
import classnames from "classnames";
import { Game } from "infrastructure/Game";
import { useGame } from "./useGame";
import VotingUnit from "./VotingUnit";
import { DistrictView } from "./DistrictView";

export default function PlayGrid({
  distribution,
  districtSize,
  win,
  className,
}: {
  distribution: string[];
  districtSize: number;
  className?: string;
  win: "RED" | "BLUE";
}) {
  const {
    constituents,
    districts,
    currentDistrict,
    gameState,
    round,
    parameters: { rows, columns },
    commands: { click, selectDistrict, resetGame },
  } = useGame(() => new Game(distribution, districtSize));

  return (
    <>
      <h2
        className={classnames("mx-auto my-4 text-2xl font-bold", {
          "text-green-500": gameState === win,
          "text-gray-700": gameState !== win,
        })}
      >
        {gameState !== "RUNNING"
          ? gameState === win
            ? "Congratulations, you won!"
            : "Sorry, it didn't work out, better luck next time."
          : ""}
      </h2>

      <ul
        key={`district-${round}`}
        className="mx-auto flex flex-wrap place-content-center items-stretch"
      >
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
        key={`grid-${round}`}
        className={classnames("mx-auto", className)}
        style={
          {
            "--rows": rows,
            "--columns": columns,
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
              --size: 64px;
            }
            @media only screen and (min-width: 600px) {
              div {
                --size: 128px;
              }
            }
          `}
        </style>
      </div>
      <button className="mx-auto mt-2 font-bold focus:outline-none" onClick={resetGame}>
        Reset Game
      </button>
    </>
  );
}

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
  win: { tribe: "RED" | "BLUE"; atLeast: number };
}) {
  const {
    constituents,
    districts,
    currentDistrict,
    gameState,
    round,
    parameters: { rows, columns },
    commands: { click, selectDistrict, resetGame },
  } = useGame(() => new Game(distribution, districtSize, win));

  return (
    <>
      <h2
        className={classnames("mx-auto my-4 text-2xl font-bold", {
          "text-green-500": gameState === "WON",
          "text-gray-700": gameState === "LOST",
        })}
      >
        {gameState !== "RUNNING"
          ? gameState === "WON"
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
              --size: 50px;
            }
            @media only screen and (min-width: 1024px) {
              div {
                --size: 100px;
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

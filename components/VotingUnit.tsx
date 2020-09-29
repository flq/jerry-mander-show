import classnames from "classnames";
import { Constituent, Coordinates, containsSide, Sides } from "infrastructure";
import { District, DistrictState } from "infrastructure/District";
import { memo } from "react";

export interface VotingUnitProps {
  constituent: Pick<Constituent, "coordinate" | "tribe">;
  borders: Constituent["borders"];
  districtState: DistrictState;
  belongsToCurrentDistrict: boolean;
  onClick: (address: Coordinates) => void;
}

function VotingUnit({ constituent: { tribe, address: coordinate }, borders, districtState, belongsToCurrentDistrict, onClick }: VotingUnitProps) {
  
  return (
    <button
      className={classnames(
        "focus:outline-none",
        "p-2",
        "flex items-stretch",
        "border-0",
        "border-solid",
        {
          "border-t-2": !belongsToCurrentDistrict && containsSide(borders, Sides.Top),
          "border-r-2": !belongsToCurrentDistrict && containsSide(borders, Sides.Right),
          "border-b-2": !belongsToCurrentDistrict && containsSide(borders, Sides.Bottom),
          "border-l-2": !belongsToCurrentDistrict && containsSide(borders, Sides.Left),
          "border-t-4": belongsToCurrentDistrict && containsSide(borders, Sides.Top),
          "border-r-4": belongsToCurrentDistrict && containsSide(borders, Sides.Right),
          "border-b-4": belongsToCurrentDistrict && containsSide(borders, Sides.Bottom),
          "border-l-4": belongsToCurrentDistrict && containsSide(borders, Sides.Left),
          "border-green-600": districtState === "COMPLETE",
          "border-red-700": districtState === "INVALID",
          "border-yellow-700": districtState === "INCOMPLETE",
        }
      )}
      onClick={() => onClick(coordinate)}
    >
      <div
        className={classnames("outline-none", "flex-grow", {
          "bg-red-600": tribe === "RED",
          "bg-blue-700": tribe === "BLUE",
        })}
      ></div>
    </button>
  );
}

export default memo(VotingUnit, (prev, next) => {
  return (
    prev.borders === next.borders &&
    prev.districtState === next.districtState &&
    prev.belongsToCurrentDistrict === next.belongsToCurrentDistrict
  );
});

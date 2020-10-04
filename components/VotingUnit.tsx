import classnames from "classnames";
import { Constituent, Coordinates, containsSide, Sides } from "infrastructure";
import { District, DistrictResult, DistrictState } from "infrastructure/District";
import { memo } from "react";

export interface VotingUnitProps {
  constituent: Pick<Constituent, "address" | "tribe">;
  borders: Constituent["borders"];
  districtState: DistrictState | null;
  districtResult: DistrictResult | null;
  belongsToCurrentDistrict: boolean;
  onClick: (address: Coordinates) => void;
}

function VotingUnit({ constituent: { tribe, address }, borders, districtState, districtResult, belongsToCurrentDistrict, onClick }: VotingUnitProps) {
  
  return (
    <button
      className={classnames(
        "focus:outline-none",
        "p-2",
        "flex flex-col items-stretch",
        "border-0",
        "border-solid",
        {
          "bg-blue-400": districtResult === "BLUE",
          "bg-red-500": districtResult === "RED",
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
      onClick={() => onClick(address)}
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
    prev.belongsToCurrentDistrict === next.belongsToCurrentDistrict &&
    prev.districtResult === next.districtResult
  );
});

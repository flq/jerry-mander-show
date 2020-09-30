import classnames from "classnames";
import { District } from "infrastructure";

export function DistrictView({
  isActive,
  district,
  index,
  onClick,
}: {
  isActive: boolean;
  district: District;
  index: number;
  onClick: (index: number) => void;
}) {
  return (
    <button
      className={classnames(
        "m-2",
        "p-2",
        "border-solid border-2 border-gray-500 rounded",
        "focus:outline-none",
        "focus:border-gray-700",
        {
          underline: isActive,
        }
      )}
      onClick={() => onClick(index)}
    >
      <div className="flex flex-col place-items-center">
        <span>District {index + 1}</span>
        <div
          className={classnames("dot", {
            "bg-gray-300": district.result === "NOT_SETTLED",
            "bg-gray-700": district.result === "DRAW",
            "bg-red-600": district.result === "RED",
            "bg-blue-600": district.result === "BLUE",
          })}
        ></div>
      </div>
      <style jsx>
        {`
          .dot {
            height: 25px;
            width: 25px;
            border-radius: 50%;
            display: inline-block;
          }
        `}
      </style>
    </button>
  );
}

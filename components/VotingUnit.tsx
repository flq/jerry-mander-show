import classnames from "classnames";

export default function VotingUnit({ tribe }: { tribe: "RED" | "BLUE" }) {
  return (
    <button className="p-2 flex items-stretch">
      <div
        className={classnames("flex-grow", {
          "bg-red-600": tribe === "RED",
          "bg-blue-700": tribe === "BLUE",
        })}
      ></div>
    </button>
  );
}

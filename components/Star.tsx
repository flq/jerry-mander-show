import classnames from "classnames";
import styles from "./Star.module.css";

export default function Star({ color }: { color: "BLUE" | "RED" }) {
  return (
    <span
      className={classnames(styles.star, {
        [styles.delay]: color === "RED",
        "text-blue-700": color === "BLUE",
        "text-red-700": color === "RED",
      })}
    >
      &#9733;
    </span>
  );
}

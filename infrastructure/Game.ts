import { District } from "./District";

export type Coordinates = [row: number, column: number];

interface Constituent {
  tribe: "RED" | "BLUE";
  coordinate: Coordinates;
}

type GameAction =
  | { type: "ToggleUnit"; coordinates: Coordinates }
  | { type: "Terminator" };

export class Game {
  constructor(distribution: string[], districtSize: number) {
    this.size = validateInitialDistribution(distribution);
    if (isNaN(this.size) || this.constituentsCount % districtSize !== 0) {
      throw Error(
        "The provided distribution and district size didn't pass the validation"
      );
    }

    this.constituents = distribution.flatMap((row, rIndex) =>
      row.split("").map((tribe, colIndex) => ({
        tribe: tribe === "1" ? "BLUE" : "RED",
        coordinate: [rIndex, colIndex],
      }))
    );

    this.districts = [...Array(this.constituentsCount / districtSize).keys()].map(
      () => new District(districtSize)
    );
  }

  private size: number;
  private districts: District[];
  private constituents: Constituent[];

  private get constituentsCount() {
    return this.size * this.size;
  }

  get allConstituents() {
    return this.constituents;
  }

  get currentDistrict() {
    return this.districts[0];
  }

  dispatch = (action: GameAction) => {
    switch (action.type) {
      case "ToggleUnit":
        return this.currentDistrict.toggle(action.coordinates);
      default:
        return this.currentDistrict.state;
    }
  };
}
/**
 * validate the distribution - it must be N strings where each string has length N and contain 1s foe the one tribe and any other char for the other
 * @param distribution the initial distribution of voting units
 * @returns the size of the distribution map
 */
export function validateInitialDistribution(distribution: string[]) {
  if (distribution[0].length !== distribution.length) return NaN;
  const size = distribution.length;
  if (distribution.some((row) => row.length !== size)) return NaN;
  return size;
}

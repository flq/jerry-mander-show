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

export class Game {
  
  constructor(distribution: string[], districtSize: number) {
    this.size = validateInitialDistribution(distribution);
    if (isNaN(this.size) ||  this.totalUnits % districtSize !== 0) {
      throw Error("The provided distribution didn't pass the validation");
    }

    this.units = distribution.flatMap((row, rIndex) =>
      row.split("").map((tribe, colIndex) => ({
        tribe: tribe === "1" ? "BLUE" : "RED",
        coordinate: [rIndex, colIndex],
        district: null,
      }))
    );
    this.districts = [...Array(this.totalUnits / districtSize).keys()].map(() => new District());
  }

  private size: number;
  private districts: District[];
  private units: Unit[];

  private get totalUnits() {
      return this.size*this.size;
  }

}

interface Unit {
  tribe: "RED" | "BLUE";
  coordinate: [row: number, column: number];
  district: District | null;
}

class District {
  
}

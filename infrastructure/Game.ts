export type Coordinates = [row: number, column: number];
type DistrictBorderUnit = { coordinates: Coordinates };

interface Unit {
  tribe: "RED" | "BLUE";
  coordinate: Coordinates;
  district: District | null;
}

type GameAction =
  | { type: "ToggleUnit"; coordinates: Coordinates }
  | { type: "Terminator" };

export class Game {
  constructor(distribution: string[], districtSize: number) {
    this.size = validateInitialDistribution(distribution);
    if (isNaN(this.size) || this.totalUnitCount % districtSize !== 0) {
      throw Error(
        "The provided distribution and district size didn't pass the validation"
      );
    }

    this.units = distribution.flatMap((row, rIndex) =>
      row.split("").map((tribe, colIndex) => ({
        tribe: tribe === "1" ? "BLUE" : "RED",
        coordinate: [rIndex, colIndex],
        district: null,
      }))
    );
    this.districts = [...Array(this.totalUnitCount / districtSize).keys()].map(
      () => new District(this.size, districtSize)
    );
  }

  private size: number;
  private districts: District[];
  private units: Unit[];

  private get totalUnitCount() {
    return this.size * this.size;
  }

  get allUnits() {
    return this.units;
  }

  get currentDistrict() {
    return this.districts[0];
  }

  dispatch = (action: GameAction) => {
    switch (action.type) {
      case "ToggleUnit":
        return this.currentDistrict.toggle(action.coordinates);
      default:
        return false;
    }
  };
}

class District {
  private _districtBorders: Map<string, DistrictBorderUnit>;

  constructor(private gridSize: number, private districtSize: number) {
    this._districtBorders = new Map<string, DistrictBorderUnit>();
  }

  get districtBorders(): DistrictBorderUnit[] {
    return Array.from(this._districtBorders.values());
  }

  toggle = (coordinates: Coordinates) => {
    const key = coordinateToString(coordinates);
    if (this._districtBorders.has(key)) {
      this._districtBorders.delete(key);
      return true;
    } else {
      if (this._districtBorders.size === 0) {
        return this.add(key, coordinates);
      }
      for (const coords of potentialNeighbours(coordinates)) {
        if (this._districtBorders.has(coordinateToString(coords))) {
          return this.add(key, coordinates);
        }
      }

      return false;
    }
  };

  private add(key: string, coordinates: Coordinates) {
    this._districtBorders.set(key, { coordinates });
    return true;
  }
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

function coordinateToString(coord: Coordinates) {
  return `(${coord[0]},${coord[1]})`;
}

function areNeighbours([refRow, refCol]: Coordinates, [otherRow, otherCol]: Coordinates) {
  if (refCol === otherCol && (refRow - 1 === otherRow || refRow + 1 === otherRow)) {
    return true;
  }
  if (refRow === otherRow && (refCol - 1 === otherCol || refCol + 1 === otherCol)) {
    return true;
  }
}

function* potentialNeighbours([originRow, originCol]: Coordinates): IterableIterator<
  Coordinates
> {
  yield [originRow + 1, originCol];
  yield [originRow - 1, originCol];
  yield [originRow, originCol + 1];
  yield [originRow, originCol - 1];
}

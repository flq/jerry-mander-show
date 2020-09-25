export type Coordinates = [row: number, column: number];

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
  private _districtUnits: Map<string, DistrictUnit>;

  constructor(private gridSize: number, private districtSize: number) {
    this._districtUnits = new Map<string, DistrictUnit>();
  }

  get districtBorders(): DistrictUnit[] {
    return Array.from(this._districtUnits.values());
  }

  toggle = (coordinates: Coordinates) => {
    const unit = new DistrictUnit(coordinates);

    if (this._districtUnits.has(unit.key)) {
      /*
        1. remove coords
        2. start visiting all contained units from one place
        3. all units must still be reachable
          -> yes: proceed
          -> no: roll back
      */
      // const markedUnit = this._districtUnits.get(key);

      this._districtUnits.delete(unit.key);
      return true;
    } else {
      if (this._districtUnits.size === 0) {
        return this.add(unit);
      }
      for (const unitKey of unit.validNeighbours()) {
        if (this._districtUnits.has(unitKey)) {
          return this.add(unit);
        }
      }

      return false;
    }
  };

  private add(unit: DistrictUnit) {
    this._districtUnits.set(unit.key, unit);
    return true;
  }
}

class DistrictUnit {
  readonly key: string;

  constructor(public coordinates: Coordinates) {
    this.key = DistrictUnit.makeKey(coordinates);
  }

  *validNeighbours(): IterableIterator<string> {
    const [originRow, originCol] = this.coordinates;
    yield DistrictUnit.makeKey([originRow + 1, originCol]);
    yield DistrictUnit.makeKey([originRow - 1, originCol]);
    yield DistrictUnit.makeKey([originRow, originCol + 1]);
    yield DistrictUnit.makeKey([originRow, originCol - 1]);
  }

  private static makeKey = ([row,col]: Coordinates) => `(${row},${col})`
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

function areNeighbours([refRow, refCol]: Coordinates, [otherRow, otherCol]: Coordinates) {
  if (refCol === otherCol && (refRow - 1 === otherRow || refRow + 1 === otherRow)) {
    return true;
  }
  if (refRow === otherRow && (refCol - 1 === otherCol || refCol + 1 === otherCol)) {
    return true;
  }
}

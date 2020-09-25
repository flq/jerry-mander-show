export type Coordinates = [row: number, column: number];
export type DistrictState = "EMPTY" | "INCOMPLETE" | "INVALID" | "COMPLETE";

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
      () => new District(districtSize)
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
        return this.currentDistrict.state;
    }
  };
}

class District {
  private _districtUnits: Map<string, DistrictUnit>;
  private _state: DistrictState = "EMPTY";

  constructor(private districtSize: number) {
    this._districtUnits = new Map<string, DistrictUnit>();
  }

  get districtUnits(): DistrictUnit[] {
    return Array.from(this._districtUnits.values());
  }

  get state(): DistrictState {
    return this._state;
  }

  toggle = (coordinates: Coordinates) => {
    const unit = new DistrictUnit(coordinates);

    if (this._districtUnits.has(unit.key)) {
      return this.handleRemoval(unit);
    } else {
      return this.handleAddition(unit);
    }
  };

  private handleAddition(unit: DistrictUnit) {
    if (this._districtUnits.size === 0) {
      this.add(unit);
      return this.updateState("INCOMPLETE");
    }
    if (this._districtUnits.size === this.districtSize) {
      return this.state;
    }

    this.add(unit);

    const isContiguous = this.isContiguousDistrict();

    if (!isContiguous) return this.updateState("INVALID");
    else if (this.isFull) return this.updateState("COMPLETE");
    else return this.updateState("INCOMPLETE");
  }

  private handleRemoval(unit: DistrictUnit) {
    
    this._districtUnits.delete(unit.key);

    if (this._districtUnits.size === 0) return this.updateState("EMPTY");

    const isContiguous = this.isContiguousDistrict();

    if (!isContiguous) return this.updateState("INVALID");
    else return this.updateState("INCOMPLETE");
  }

  private add(unit: DistrictUnit) {
    this._districtUnits.set(unit.key, unit);
  }

  private updateState(newState: District["state"]) {
    this._state = newState;
    return this._state;
  }

  private isContiguousDistrict() {
    var memoryPad = new Set<string>();
    this.firstUnit.visitAllNeighbours(memoryPad, this._districtUnits);
    return memoryPad.size === this._districtUnits.size;
  }

  private get firstUnit() {
    return this._districtUnits.values().next().value as DistrictUnit;
  }

  private get isFull() {
    return this._districtUnits.size === this.districtSize;
  }

  private get isEmpty() {
    return this._districtUnits.size === 0;
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

  visitAllNeighbours(memoryPad: Set<string>, districtUnits: Map<string, DistrictUnit>) {
    memoryPad.add(this.key);

    for (const directNeighbour of this.myNeighbours(districtUnits)) {
      if (!memoryPad.has(directNeighbour.key)) {
        directNeighbour.visitAllNeighbours(memoryPad, districtUnits);
      }
    }
  }

  private *myNeighbours(
    districtUnits: Map<string, DistrictUnit>
  ): IterableIterator<DistrictUnit> {
    for (const potentialNeighbourKey of this.validNeighbours()) {
      if (districtUnits.has(potentialNeighbourKey)) {
        yield districtUnits.get(potentialNeighbourKey);
      }
    }
  }

  private static makeKey = ([row, col]: Coordinates) => `(${row},${col})`;
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

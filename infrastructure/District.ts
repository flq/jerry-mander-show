import { Coordinates } from "./Game";
import { AssignedConstituent } from "./AssignedConstituent";

export type DistrictState = "EMPTY" | "INCOMPLETE" | "INVALID" | "COMPLETE";

export class District {
  private readonly _districtUnits: Map<string, AssignedConstituent>;
  private _state: DistrictState = "EMPTY";

  constructor(private districtSize: number) {
    this._districtUnits = new Map<string, AssignedConstituent>();
  }

  get districtUnits(): AssignedConstituent[] {
    return Array.from(this._districtUnits.values());
  }

  get state(): DistrictState {
    return this._state;
  }

  toggle = (coordinates: Coordinates) => {
    const unit = new AssignedConstituent(coordinates, this._districtUnits);

    if (this._districtUnits.has(unit.key)) {
      return this.handleRemoval(unit);
    } else {
      return this.handleAddition(unit);
    }
  };

  private handleAddition(unit: AssignedConstituent) {
    if (this._districtUnits.size === 0) {
      this.add(unit);
      return this.updateState("INCOMPLETE");
    }
    if (this._districtUnits.size === this.districtSize) {
      return this.state;
    }

    this.add(unit);

    const isContiguous = this.isContiguousDistrict();

    if (!isContiguous)
      return this.updateState("INVALID");
    else if (this.isFull)
      return this.updateState("COMPLETE");
    else
      return this.updateState("INCOMPLETE");
  }

  private handleRemoval(unit: AssignedConstituent) {

    this._districtUnits.delete(unit.key);

    if (this.isEmpty)
      return this.updateState("EMPTY");

    const isContiguous = this.isContiguousDistrict();

    if (!isContiguous)
      return this.updateState("INVALID");
    else
      return this.updateState("INCOMPLETE");
  }

  private add(unit: AssignedConstituent) {
    this._districtUnits.set(unit.key, unit);
  }

  private updateState(newState: District["state"]) {
    this._state = newState;
    return this._state;
  }

  private isContiguousDistrict() {
    var memoryPad = new Set<string>();
    this.firstUnit.visitAllNeighbours(memoryPad);
    return memoryPad.size === this._districtUnits.size;
  }

  private get firstUnit() {
    return this._districtUnits.values().next().value as AssignedConstituent;
  }

  private get isFull() {
    return this._districtUnits.size === this.districtSize;
  }

  private get isEmpty() {
    return this._districtUnits.size === 0;
  }
}

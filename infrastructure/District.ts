import { Coordinates } from "./Game";
import { AssignedConstituent, coordinatesToString } from "./AssignedConstituent";

export type DistrictState = "EMPTY" | "INCOMPLETE" | "INVALID" | "COMPLETE";

export class District {

  private readonly _districtConstituents: Map<string, AssignedConstituent>;
  private _state: DistrictState = "EMPTY";

  constructor(private districtSize: number) {
    this._districtConstituents = new Map<string, AssignedConstituent>();
  }

  get districtConstituents(): AssignedConstituent[] {
    return Array.from(this._districtConstituents.values());
  }

  get state(): DistrictState {
    return this._state;
  }

  toggle = (coordinates: Coordinates) => {
    const constituentAddress = coordinatesToString(coordinates);

    if (this._districtConstituents.has(constituentAddress)) {
      return this.handleRemoval(constituentAddress);
    } else {
      return this.handleAddition(new AssignedConstituent(coordinates, this._districtConstituents));
    }
  };

  private handleAddition(constituent: AssignedConstituent) {
    if (this._districtConstituents.size === 0) {
      this.add(constituent);
      return this.updateState("INCOMPLETE");
    }
    if (this._districtConstituents.size === this.districtSize) {
      return this.state;
    }

    this.add(constituent);

    const isContiguous = this.isContiguousDistrict();

    if (!isContiguous)
      return this.updateState("INVALID");
    else if (this.isFull)
      return this.updateState("COMPLETE");
    else
      return this.updateState("INCOMPLETE");
  }

  private handleRemoval(constituentKey: string) {
    
    const constituent = this._districtConstituents.get(constituentKey);
    this._districtConstituents.delete(constituentKey);
    constituent.updateBordersAfterRemoval();

    if (this.isEmpty)
      return this.updateState("EMPTY");

    const isContiguous = this.isContiguousDistrict();

    if (!isContiguous)
      return this.updateState("INVALID");
    else
      return this.updateState("INCOMPLETE");
  }

  private add(unit: AssignedConstituent) {
    this._districtConstituents.set(unit.key, unit);
    unit.updateBordersAfterInsertion();
  }

  private updateState(newState: District["state"]) {
    this._state = newState;
    return this._state;
  }

  private isContiguousDistrict() {
    var memoryPad = new Set<string>();
    this.firstUnit.visitAllNeighbours(memoryPad);
    return memoryPad.size === this._districtConstituents.size;
  }

  private get firstUnit() {
    return this._districtConstituents.values().next().value as AssignedConstituent;
  }

  private get isFull() {
    return this._districtConstituents.size === this.districtSize;
  }

  private get isEmpty() {
    return this._districtConstituents.size === 0;
  }
}

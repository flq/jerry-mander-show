import {
  AssignedConstituent,
  BorderUpdateBatch,
  Constituent,
  coordinatesToString,
} from "./AssignedConstituent";

export type DistrictState = "EMPTY" | "INCOMPLETE" | "INVALID" | "COMPLETE";
export type DistrictResult = "NOT_SETTLED" | "RED" | "BLUE" | "DRAW";
export type ToggleOperationResult = {
  state: DistrictState;
  borderUpdates: BorderUpdateBatch;
};

export interface District {
  state: DistrictState;
  result: DistrictResult;
  assignedConstituents: AssignedConstituent[];
}

export class DistrictImpl implements District {
  private readonly _districtConstituents: Map<string, AssignedConstituent>;
  private _state: DistrictState = "EMPTY";
  private _result: DistrictResult = "NOT_SETTLED";

  constructor(private districtSize: number) {
    this._districtConstituents = new Map<string, AssignedConstituent>();
  }

  get assignedConstituents(): AssignedConstituent[] {
    return Array.from(this._districtConstituents.values());
  }

  get result(): DistrictResult {
    return this._result;
  }

  get state(): DistrictState {
    return this._state;
  }

  toggle = (constituent: Constituent): ToggleOperationResult => {
    const constituentAddress = coordinatesToString(constituent.address);

    if (this._districtConstituents.has(constituentAddress)) {
      return this.handleRemoval(constituentAddress);
    } else {
      return this.handleAddition(
        new AssignedConstituent(constituent, this._districtConstituents)
      );
    }
  };

  contains(address: string) {
    return this._districtConstituents.has(address);
  }

  private handleAddition(constituent: AssignedConstituent): ToggleOperationResult {
    if (this._districtConstituents.size === 0) {
      return {
        state: this.updateState("INCOMPLETE"),
        borderUpdates: this.add(constituent),
      };
    }
    if (this._districtConstituents.size === this.districtSize) {
      return { state: this.state, borderUpdates: [] };
    }

    const borderUpdates = this.add(constituent);

    const isContiguous = this.isContiguousDistrict();

    if (!isContiguous) return { state: this.updateState("INVALID"), borderUpdates };
    else if (this.isFull) return { state: this.updateState("COMPLETE"), borderUpdates };
    else return { state: this.updateState("INCOMPLETE"), borderUpdates };
  }

  private handleRemoval(constituentKey: string): ToggleOperationResult {
    const constituent = this._districtConstituents.get(constituentKey);
    this._districtConstituents.delete(constituentKey);
    const borderUpdates = constituent.updateBordersAfterRemoval();

    if (this.isEmpty) return { state: this.updateState("EMPTY"), borderUpdates };

    const isContiguous = this.isContiguousDistrict();

    if (!isContiguous) return { state: this.updateState("INVALID"), borderUpdates };
    else return { state: this.updateState("INCOMPLETE"), borderUpdates };
  }

  private add(unit: AssignedConstituent) {
    this._districtConstituents.set(unit.key, unit);
    return unit.updateBordersAfterInsertion();
  }

  private updateState(newState: District["state"]) {
    if (newState === "COMPLETE") {
      const { reds, blues } = this.assignedConstituents.reduce(
        (current, next) => {
          if (next.constituent.tribe === "RED") {
            current.reds++;
          } else {
            current.blues++;
          }
          return current;
        },
        { reds: 0, blues: 0 }
      );
      this._result = reds > blues ? "RED" : blues > reds ? "BLUE" : "DRAW";
    } else {
      this._result = "NOT_SETTLED";
    }
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

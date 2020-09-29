import { coordinatesToString, Sides } from "./AssignedConstituent";
import { District, DistrictImpl } from "./District";

export type Coordinates = [row: number, column: number];

export interface Constituent {
  tribe: "RED" | "BLUE";
  address: Coordinates;
  borders: Sides;
  district: District | null;
}

type GameAction =
  | { type: "ToggleUnit"; coordinates: Coordinates }
  | { type: "SwitchDistrict"; index?: number }
  | { type: "Terminator" };

export class Game {
  constructor(distribution: string[], public districtSize: number) {
    this.size = validateInitialDistribution(distribution);
    if (isNaN(this.size) || this.constituentsCount % districtSize !== 0) {
      throw Error(
        "The provided distribution and district size didn't pass the validation"
      );
    }

    this.constituents = new Map<string, Constituent>(
      distribution.flatMap((row, rIndex) =>
        row.split("").map((tribe, colIndex) => {
          const address = [rIndex, colIndex] as Coordinates;
          const key = coordinatesToString(address);
          return [
            key,
            {
              tribe: tribe === "1" ? "BLUE" : "RED",
              address,
              borders: Sides.None,
              district: null
            },
          ];
        })
      )
    );

    this.districts = [...Array(this.constituentsCount / districtSize).keys()].map(
      () => new DistrictImpl(districtSize)
    );
  }

  size: number;
  
  private districts: DistrictImpl[];
  private constituents: Map<string, Constituent>;
  private currentDistrictIndex = 0;

  private get constituentsCount() {
    return this.size * this.size;
  }

  get allConstituents() {
    return this.constituents.entries();
  }

  get allDistricts() : District[] {
    return this.districts;
  }

  get currentDistrict() : District {
    return this.districts[this.currentDistrictIndex];
  }

  dispatch = (action: GameAction) => {
    switch (action.type) {
      case "ToggleUnit":
        if (!this.constituentIsInOtherDistrict(action.coordinates)) {
          const addressKey = coordinatesToString(action.coordinates);
          const { borderUpdates } = this.districts[this.currentDistrictIndex].toggle(this.constituents.get(addressKey));
          borderUpdates.forEach(([address, borders]) => {
            const constituent = this.constituents.get(coordinatesToString(address));
            constituent.borders = borders;
            // No borders can only mean no district - anything else means the op against
            // the current district resulted in some borders
            constituent.district = borders === Sides.None ? null : this.currentDistrict;
          });
        }
        break;
      case "SwitchDistrict":
        if (this.isDefinedAndValidDistrictIndex(action.index)) {
          this.currentDistrictIndex = action.index;
        } else if (action.index === undefined) {
          this.stepUpDistrictIndex();
        }
    }
  };

  private isDefinedAndValidDistrictIndex(index: number | undefined) {
    return index !== undefined && index >= 0 && index < this.districts.length;
  }

  private stepUpDistrictIndex() {
    const newIndex =
      this.currentDistrictIndex === this.districts.length - 1
        ? 0
        : this.currentDistrictIndex + 1;
    this.currentDistrictIndex = newIndex;
  }

  private constituentIsInOtherDistrict(coordinates: Coordinates) {
    const address = coordinatesToString(coordinates);
    for (const district of this.allButCurrentDistrict()) {
      if (district.contains(address)) return true;
    }
    return false;
  }

  private *allButCurrentDistrict() {
    for (let idx = 0; idx < this.districts.length; idx++) {
      if (idx !== this.currentDistrictIndex) yield this.districts[idx];
    }
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

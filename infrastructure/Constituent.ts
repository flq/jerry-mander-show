import { District } from "./District";

export interface Constituent {
    tribe: "RED" | "BLUE";
    address: Coordinates;
  }

export class ConstituentImpl implements Constituent {
    constructor(public tribe: Constituent["tribe"], public address:Coordinates) {

    }

    addToDistrict(district: District) {
        district.districtConstituents
    }
}
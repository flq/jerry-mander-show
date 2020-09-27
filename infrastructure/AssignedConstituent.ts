import { Coordinates } from "./Game";


export class AssignedConstituent {
  readonly key: string;

  constructor(public coordinates: Coordinates, private districtConstituents: Map<string, AssignedConstituent>) {
    this.key = AssignedConstituent.makeKey(coordinates);
  }

  *validNeighbours(): IterableIterator<string> {
    const [originRow, originCol] = this.coordinates;
    yield AssignedConstituent.makeKey([originRow + 1, originCol]);
    yield AssignedConstituent.makeKey([originRow - 1, originCol]);
    yield AssignedConstituent.makeKey([originRow, originCol + 1]);
    yield AssignedConstituent.makeKey([originRow, originCol - 1]);
  }

  visitAllNeighbours(memoryPad: Set<string>) {
    memoryPad.add(this.key);

    for (const directNeighbour of this.myNeighbours()) {
      if (!memoryPad.has(directNeighbour.key)) {
        directNeighbour.visitAllNeighbours(memoryPad);
      }
    }
  }

  private *myNeighbours(): IterableIterator<AssignedConstituent> {
    for (const potentialNeighbourKey of this.validNeighbours()) {
      if (this.districtConstituents.has(potentialNeighbourKey)) {
        yield this.districtConstituents.get(potentialNeighbourKey);
      }
    }
  }

  private static makeKey = ([row, col]: Coordinates) => `(${row},${col})`;
}

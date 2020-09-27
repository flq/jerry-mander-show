import { Coordinates } from "./Game";


export enum Sides {
  None = 0,
  Top = 1 << 0,
  Right = 1 << 1,
  Bottom = 1 << 2,
  Left = 1 << 3,
  All = ~(~0 << 4)
}

export function containsSide(borders: Sides, value: Sides) {
  return (borders & value) === value;
}

function opposite(sides: Sides) {
  switch (sides) {
    case Sides.Bottom: return Sides.Top;
    case Sides.Top: return Sides.Bottom;
    case Sides.Left: return Sides.Right;
    case Sides.Right: return Sides.Left;
  }
}

export class AssignedConstituent {
  readonly key: string;
  private _borders : Sides = Sides.None;

  constructor(public coordinates: Coordinates, private districtConstituents: Map<string, AssignedConstituent>) {
    this.key = AssignedConstituent.makeKey(coordinates);
  }

  get borders() {
    return this._borders;
  }



  visitAllNeighbours(memoryPad: Set<string>) {
    memoryPad.add(this.key);

    for (const [directNeighbour] of this.myNeighbours()) {
      if (!memoryPad.has(directNeighbour.key)) {
        directNeighbour.visitAllNeighbours(memoryPad);
      }
    }
  }

  updateBordersAfterInsertion() {
    let newBorders = Sides.All;
    for (const [neighbour, direction] of this.myNeighbours()) {
      newBorders &= ~direction;
      neighbour.removeBorder(opposite(direction))
    }
    this._borders = newBorders;
  }

  private *myNeighbours(): IterableIterator<[neighbour: AssignedConstituent, direction: Sides]> {
    for (const [potentialNeighbourKey, direction] of this.validNeighbours()) {
      if (this.districtConstituents.has(potentialNeighbourKey)) {
        yield [this.districtConstituents.get(potentialNeighbourKey), direction];
      }
    }
  }

  private removeBorder(border: Sides) {
    this._borders &= ~border;
  }

  private *validNeighbours(): IterableIterator<[key: string, direction: Sides]> {
    const [originRow, originCol] = this.coordinates;
    yield [AssignedConstituent.makeKey([originRow + 1, originCol]), Sides.Right];
    yield [AssignedConstituent.makeKey([originRow - 1, originCol]), Sides.Left];
    yield [AssignedConstituent.makeKey([originRow, originCol + 1]), Sides.Bottom];
    yield [AssignedConstituent.makeKey([originRow, originCol - 1]), Sides.Top];
  }

  private static makeKey = ([row, col]: Coordinates) => `(${row},${col})`;
}
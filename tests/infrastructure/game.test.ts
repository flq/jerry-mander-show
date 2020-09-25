import { Game, Coordinates } from "infrastructure/Game";

const newSimpleGame = () => new Game(["001", "010", "100"], 3);

describe("infrastructure/game", () => {
  test.each([
    [["10", "10", "10"], 3],
    [["100", "100"], 3],
    [["100", "100", "100"], 4],
  ])("disallows misconfiguration", (distribution: string[], districtNum: number) => {
    expect(() => new Game(distribution, districtNum)).toThrowError();
  });

  test("correctly initializes the units", () => {
    const game = newSimpleGame();
    expect(game.allUnits).toHaveLength(9);

    const unitIn1stRow = game.allUnits[2];
    expect(unitIn1stRow.tribe).toBe("BLUE");
    expect(unitIn1stRow.coordinate).toStrictEqual([0, 2]);

    const lastUnit = game.allUnits[8];
    expect(lastUnit.tribe).toBe("RED");
    expect(lastUnit.coordinate).toStrictEqual([2, 2]);
  });

  test("makes a current, empty district available", () => {
    const game = newSimpleGame();
    expect(game.currentDistrict).not.toBeNull();
    expect(game.currentDistrict.districtBorders).toHaveLength(0);
  });

  test("adds (and removes) coords to belong to empty districts", () => {
    const game = newSimpleGame();
    let check = game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
    expect(check).toBeTruthy();
    expect(game.currentDistrict.districtBorders).toHaveLength(1);
    expect(game.currentDistrict.districtBorders[0].coordinates).toStrictEqual([0, 0]);

    check = game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
    expect(check).toBeTruthy();
    expect(game.currentDistrict.districtBorders).toHaveLength(0);
  });

  test("adds a valid additional set of coordinates", () => {
    const game = newSimpleGame();
    game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
    const check = game.dispatch({ type: "ToggleUnit", coordinates: [0, 1] });

    expect(check).toBeTruthy();
    expect(game.currentDistrict.districtBorders).toHaveLength(2);
  });

  test.each([
    [[0, 0], false],
    [[0, 1], true],
    [[0, 2], false],
    [[1, 0], true],
    [[1, 2], true],
    [[2, 0], false],
    [[2, 1], true],
    [[2, 2], false],
  ])(
    "Is %p close to [1,1] ? %p",
    (coordinates: Coordinates, expectedSuccess: boolean) => {
      const game = newSimpleGame();
      game.dispatch({ type: "ToggleUnit", coordinates: [1, 1] });
      const check = game.dispatch({ type: "ToggleUnit", coordinates });

      expect(check).toBe(expectedSuccess);
      expect(game.currentDistrict.districtBorders).toHaveLength(expectedSuccess ? 2 : 1);
    }
  );

  test("remove coords that leave district valid", () => {
    const game = newSimpleGame();
    for (const coordinates of [
      [0, 0],
      [1, 0],
      [1, 1],
    ] as Coordinates[]) {
      game.dispatch({ type: "ToggleUnit", coordinates });
    }
    expect(game.currentDistrict.districtBorders).toHaveLength(3);

    game.dispatch({ type: "ToggleUnit", coordinates: [1,1] });
    expect(game.currentDistrict.districtBorders).toHaveLength(2);


  });
});

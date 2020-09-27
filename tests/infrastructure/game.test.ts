import { Game, Coordinates, DistrictState } from "infrastructure";

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
    expect(game.allConstituents).toHaveLength(9);

    const unitIn1stRow = game.allConstituents[2];
    expect(unitIn1stRow.tribe).toBe("BLUE");
    expect(unitIn1stRow.coordinate).toStrictEqual([0, 2]);

    const lastUnit = game.allConstituents[8];
    expect(lastUnit.tribe).toBe("RED");
    expect(lastUnit.coordinate).toStrictEqual([2, 2]);
  });

  test("makes a current, empty district available", () => {
    const game = newSimpleGame();
    expect(game.currentDistrict).not.toBeNull();
    expect(game.currentDistrict.districtUnits).toHaveLength(0);
  });

  test("adds (and removes) coords to belong to empty districts", () => {
    const game = newSimpleGame();
    let check = game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
    expect(check).toBeTruthy();
    expect(game.currentDistrict.districtUnits).toHaveLength(1);
    expect(game.currentDistrict.districtUnits[0].coordinates).toStrictEqual([0, 0]);

    check = game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
    expect(check).toBeTruthy();
    expect(game.currentDistrict.districtUnits).toHaveLength(0);
  });

  test("adds a valid additional set of coordinates", () => {
    const game = newSimpleGame();
    game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
    const check = game.dispatch({ type: "ToggleUnit", coordinates: [0, 1] });

    expect(check).toBeTruthy();
    expect(game.currentDistrict.districtUnits).toHaveLength(2);
  });

  test.each([
    [[0, 0], "INVALID"],
    [[0, 1], "INCOMPLETE"],
    [[0, 2], "INVALID"],
    [[1, 0], "INCOMPLETE"],
    [[1, 2], "INCOMPLETE"],
    [[2, 0], "INVALID"],
    [[2, 1], "INCOMPLETE"],
    [[2, 2], "INVALID"],
  ])(
    "Is %p close to [1,1] ? %p",
    (coordinates: Coordinates, expectedState: DistrictState) => {
      const game = newSimpleGame();
      game.dispatch({ type: "ToggleUnit", coordinates: [1, 1] });
      const check = game.dispatch({ type: "ToggleUnit", coordinates });

      expect(check).toBe(expectedState);
      expect(game.currentDistrict.districtUnits).toHaveLength(expectedState ? 2 : 1);
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
    expect(game.currentDistrict.districtUnits).toHaveLength(3);
    expect(game.currentDistrict.state).toBe("COMPLETE");

    game.dispatch({ type: "ToggleUnit", coordinates: [1,1] });
    expect(game.currentDistrict.districtUnits).toHaveLength(2);
    expect(game.currentDistrict.state).toBe("INCOMPLETE");
  });

  test("remove coords that destroy contiguousness is reflected in state", () => {
    const game = newSimpleGame();
    for (const coordinates of [
      [0, 0],
      [1, 0],
      [1, 1],
    ] as Coordinates[]) {
      game.dispatch({ type: "ToggleUnit", coordinates });
    }
    
    game.dispatch({ type: "ToggleUnit", coordinates: [1,0] });
    
    expect(game.currentDistrict.districtUnits).toHaveLength(2);
    expect(game.currentDistrict.state).toBe("INVALID");
  });

  test("when district goes empty it is reflected in state", () => {
    const game = newSimpleGame();
    let state = game.dispatch({ type: "ToggleUnit", coordinates: [0,0] });
    expect(game.currentDistrict.state).toBe("INCOMPLETE");
    state = game.dispatch({ type: "ToggleUnit", coordinates: [1,1] });
    expect(game.currentDistrict.state).toBe("INVALID");

    state = game.dispatch({ type: "ToggleUnit", coordinates: [0,0] });
    expect(game.currentDistrict.state).toBe("INCOMPLETE");
    state = game.dispatch({ type: "ToggleUnit", coordinates: [1,1] });
    expect(game.currentDistrict.state).toBe("EMPTY");
  })
});

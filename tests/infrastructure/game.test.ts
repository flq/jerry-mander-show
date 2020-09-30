import { Game, Coordinates, DistrictState, containsSide, Sides } from "infrastructure";

const newSimpleGame = () => new Game(["001", "010", "100"], 3);

describe("infrastructure/game", () => {

  test("correctly initializes the constituents", () => {
    const game = newSimpleGame();
    const constituents = Array.from(game.allConstituents);
    expect(constituents).toHaveLength(9);

    const unitIn1stRow = constituents[2][1];
    expect(unitIn1stRow.tribe).toBe("BLUE");
    expect(unitIn1stRow.address).toStrictEqual([0, 2]);

    const lastUnit = constituents[8][1];
    expect(lastUnit.tribe).toBe("RED");
    expect(lastUnit.address).toStrictEqual([2, 2]);
  });

  test("makes a current, empty district available", () => {
    const game = newSimpleGame();
    expect(game.currentDistrict).not.toBeNull();
    expect(game.currentDistrict.assignedConstituents).toHaveLength(0);
  });

  test("adds (and removes) coords to belong to empty districts", () => {
    const game = newSimpleGame();
    game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });

    expect(game.currentDistrict.assignedConstituents).toHaveLength(1);
    expect(
      game.currentDistrict.assignedConstituents[0].constituent.address
    ).toStrictEqual([0, 0]);

    game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });

    expect(game.currentDistrict.assignedConstituents).toHaveLength(0);
  });

  test("getting results for districts", () => {
    const game = newSimpleGame();
    for (const coordinates of [
      [2, 0],
      [2, 1],
      [1, 1],
    ] as Coordinates[])
      game.dispatch({ type: "ToggleUnit", coordinates });

    game.dispatch({ type: "SwitchDistrict" });

    for (const coordinates of [
      [0, 0],
      [0, 1],
      [0, 2],
    ] as Coordinates[])
      game.dispatch({ type: "ToggleUnit", coordinates });

      expect(game.allDistricts[0].result).toBe("BLUE");
      expect(game.allDistricts[1].result).toBe("RED");
      expect(game.allDistricts[2].result).toBe("NOT_SETTLED");
  });

  describe("Validation", () => {
    test.each([
      [["10", "10", "10"], 3],
      [["100", "100"], 3],
      [["100", "100", "100"], 4],
    ])("disallows misconfiguration %#", (distribution: string[], districtNum: number) => {
      expect(() => new Game(distribution, districtNum)).toThrowError();
    });
  });

  describe("addition", () => {
    test("adds a valid additional set of coordinates", () => {
      const game = newSimpleGame();
      game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
      game.dispatch({ type: "ToggleUnit", coordinates: [0, 1] });
      expect(game.currentDistrict.assignedConstituents).toHaveLength(2);
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
        game.dispatch({ type: "ToggleUnit", coordinates });

        expect(game.currentDistrict.state).toBe(expectedState);
        expect(game.currentDistrict.assignedConstituents).toHaveLength(
          expectedState ? 2 : 1
        );
      }
    );
  });

  describe("Removal", () => {
    test("remove coords that leave district valid", () => {
      const game = newSimpleGame();
      for (const coordinates of [
        [0, 0],
        [1, 0],
        [1, 1],
      ] as Coordinates[]) {
        game.dispatch({ type: "ToggleUnit", coordinates });
      }
      expect(game.currentDistrict.assignedConstituents).toHaveLength(3);
      expect(game.currentDistrict.state).toBe("COMPLETE");

      game.dispatch({ type: "ToggleUnit", coordinates: [1, 1] });
      expect(game.currentDistrict.assignedConstituents).toHaveLength(2);
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

      game.dispatch({ type: "ToggleUnit", coordinates: [1, 0] });

      expect(game.currentDistrict.assignedConstituents).toHaveLength(2);
      expect(game.currentDistrict.state).toBe("INVALID");
    });

    test("when district goes empty it is reflected in state", () => {
      const game = newSimpleGame();
      let state = game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
      expect(game.currentDistrict.state).toBe("INCOMPLETE");
      state = game.dispatch({ type: "ToggleUnit", coordinates: [1, 1] });
      expect(game.currentDistrict.state).toBe("INVALID");

      state = game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
      expect(game.currentDistrict.state).toBe("INCOMPLETE");
      state = game.dispatch({ type: "ToggleUnit", coordinates: [1, 1] });
      expect(game.currentDistrict.state).toBe("EMPTY");
    });
  });

  describe("Borders", () => {
    test("A single consituent has borders to all directions", () => {
      const game = newSimpleGame();
      game.dispatch({ type: "ToggleUnit", coordinates: [1, 1] });
      const currentBorders = game.currentDistrict.assignedConstituents[0].borders;
      expect(containsSide(currentBorders, Sides.All)).toBeTruthy();
    });

    test("Adding a 2nd adapts the borders as necessary", () => {
      const game = newSimpleGame();
      game.dispatch({ type: "ToggleUnit", coordinates: [1, 1] });
      game.dispatch({ type: "ToggleUnit", coordinates: [1, 2] });

      const borders1 = game.currentDistrict.assignedConstituents[0].borders;
      const borders2 = game.currentDistrict.assignedConstituents[1].borders;

      expect(containsSide(borders1, Sides.Left | Sides.Top | Sides.Bottom)).toBeTruthy();
      expect(containsSide(borders1, Sides.Right)).toBeFalsy();

      expect(containsSide(borders2, Sides.Top | Sides.Bottom | Sides.Right)).toBeTruthy();
      expect(containsSide(borders2, Sides.Left)).toBeFalsy();
    });

    test("Proper neighbour updates in case of removal", () => {
      const game = newSimpleGame();
      game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
      game.dispatch({ type: "ToggleUnit", coordinates: [0, 1] });
      game.dispatch({ type: "ToggleUnit", coordinates: [1, 1] });

      let borders1 = game.currentDistrict.assignedConstituents[0].borders;
      let borders2 = game.currentDistrict.assignedConstituents[2].borders;

      expect(containsSide(borders1, Sides.Right)).toBeFalsy();
      expect(containsSide(borders2, Sides.Top)).toBeFalsy();

      game.dispatch({ type: "ToggleUnit", coordinates: [0, 1] });

      borders1 = game.currentDistrict.assignedConstituents[0].borders;
      borders2 = game.currentDistrict.assignedConstituents[1].borders;

      expect(containsSide(borders1, Sides.Right)).toBeTruthy();
      expect(containsSide(borders2, Sides.Top)).toBeTruthy();
    });
  });

  describe("With several districts", () => {
    test("District switching works", () => {
      const game = newSimpleGame();
      expect(game.allDistricts[0]).toBe(game.currentDistrict);
      game.dispatch({ type: "SwitchDistrict" });
      expect(game.allDistricts[1]).toBe(game.currentDistrict);
    });

    test("address cannot be assigned to 2 districts", () => {
      const game = newSimpleGame();
      game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });
      game.dispatch({ type: "SwitchDistrict" });
      game.dispatch({ type: "ToggleUnit", coordinates: [0, 0] });

      expect(game.allDistricts[0].assignedConstituents).toHaveLength(1);
      expect(game.allDistricts[1].state).toBe("EMPTY");
      expect(game.allDistricts[1].assignedConstituents).toHaveLength(0);
    });
  });
});

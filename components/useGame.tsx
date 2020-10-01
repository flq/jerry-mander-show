import { Game, Coordinates } from "infrastructure";
import { useEffect, useMemo, useState } from "react";

export function useGame(gameFactory: () => Game) {
  const [game, resetGame] = useState(gameFactory);
  const [round, setRound] = useState(0);
  const [constituents, setConstituents] = useState(() =>
    Array.from(game.allConstituents)
  );
  const [currentDistrict, setCurrentDistrict] = useState(game.currentDistrict);
  const parameters = useMemo(
    () => ({
      rows: game.size,
      columns: game.size,
    }),
    [game]
  );
  const commands = useMemo(
    () => ({
      click(address: Coordinates) {
        game.dispatch({ type: "ToggleUnit", coordinates: address });
        const constituents = Array.from(game.allConstituents);
        setConstituents(constituents);
      },
      selectDistrict(index: number) {
        game.dispatch({ type: "SwitchDistrict", index });
        setCurrentDistrict(game.currentDistrict);
      },
      resetGame() {
        resetGame(gameFactory());
      },
    }),
    [game]
  );

  useEffect(() => {
    const constituents = Array.from(game.allConstituents);
    setConstituents(constituents);
    setCurrentDistrict(game.currentDistrict);
    setRound(r => r + 1);
  }, [game]);

  return {
    currentDistrict,
    districts: game.allDistricts,
    gameState: game.state,
    round,
    constituents,
    parameters,
    commands,
  };
}

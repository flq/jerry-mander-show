import { useRouter } from "next/router";
import PlayGrid from "components/PlayGrid";
import { maps } from "infrastructure/maps";

export default function Game() {
  const {
    query: { index },
  } = useRouter();
  const gameIndex = parseInt(index as string);
  const map = isNaN(gameIndex) ? null : maps[gameIndex];
  return (
    <div className="container mx-auto mt-2 flex justify-center flex-col">
      {map ? (
        <>
          <header>
            <h1 className="text-2xl lg:text-3xl">{map.title}</h1>
            <p className="mt-2">{map.description}</p>
          </header>
          <PlayGrid className="mt-4" distribution={map.distribution} />
        </>
      ) : (
        <h2>Unable to retrieve a game with the index {index}</h2>
      )}
    </div>
  );
}

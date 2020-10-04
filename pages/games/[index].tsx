import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useErrorBoundary } from "use-error-boundary";
import PlayGrid from "components/PlayGrid";
import { maps } from "infrastructure/maps";

export default function Game() {
  const {
    query: { index },
  } = useRouter();
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();
  const gameIndex = parseInt(index as string);
  const map = isNaN(gameIndex) ? null : maps[gameIndex];

  return (
    <div className="container mx-auto mt-2 flex justify-center flex-col">
      <Head>
        <title>Game: {map?.title ?? "..."}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {map ? (
        <>
          <header className="m-2">
            <nav>
              <Link href="/">
                <a>Home</a>
              </Link>
              {
                maps[gameIndex + 1] && <> | <Link href={`/games/${gameIndex + 1}`}>
                  <a>Next game</a>
                </Link></>
              }
            </nav>
            <h1 className="text-2xl lg:text-3xl">{map.title}</h1>
            <p className="mt-2">{map.description}</p>
          </header>
          {didCatch ? (
            <h2>The game produced an error: {error}</h2>
          ) : (
              <ErrorBoundary>
                <PlayGrid
                  key={gameIndex}
                  distribution={map.distribution}
                  districtSize={map.districtSize}
                  win={map.win}
                />
              </ErrorBoundary>
            )}
        </>
      ) : (
          <h2>Unable to retrieve a game with the index {index}</h2>
        )}
    </div>
  );
}

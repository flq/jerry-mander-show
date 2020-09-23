import React from "react";
import PlayGrid from "../components/PlayGrid";
import QAndA from "../components/QAndA";
import VotingUnit from "../components/VotingUnit";

export default function Home() {
  return (
    <div className="container mx-auto mt-2 flex justify-center flex-col">
      <h1 className="text-2xl lg:text-3xl">Welcome to the Jerry Mander Show!</h1>
      <ul>
        <QAndA question="What's the Jerry Mander Show?">
          Gerrymandering is a hugely popular sport in US-politics, played by Democrats and Trumpians alike. If
          you want to know more, you can have a look at my website,{" "}
          <a href="https://realfiction.net/2017/01/18/an-outsiders-guide-to-gerrymandering">
            An outsider's guide to gerrymandering
          </a>
        </QAndA>
      </ul>
      <PlayGrid columns={6} rows={6}>
        { Array(36).fill(1).map((_,index) => <VotingUnit key={index} tribe={index % 2 === 0 ? "BLUE" : "RED" } />) }
      </PlayGrid>
    </div>
  );
}

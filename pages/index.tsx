import React from "react";
import Link from 'next/link'
import QAndA from "components/QAndA";

export default function Home() {
  return (
    <div className="container mx-auto mt-2 flex justify-center flex-col">
      <h1 className="text-2xl lg:text-3xl">Welcome to the Jerry Mander Show!</h1>
      <ul className="mt-4">
        <QAndA question="What's the Jerry Mander Show?">
          Gerrymandering is a hugely popular sport in US-politics, played by Democrats and Trumpians alike. If
          you want to know more, you can have a look at my website,{" "}
          <a href="https://realfiction.net/2017/01/18/an-outsiders-guide-to-gerrymandering">
            An outsider's guide to gerrymandering
          </a>
        </QAndA>
        <QAndA question="TL;DR; What are the rules?">
          <ul className="list-disc">
            <li>Each game shows a grid with n x n units that either belong to red or blue</li>
            <li>The description tells you who doesn't have the popular vote. Your job is to cut the districts such that you get the mejority of districts anyway.</li>
            <li>Hard rules:</li>
            <ol className="list-decimal ml-4">
              <li>Districts must be contiguous</li>
              <li>Each district must have the same amount of units</li>
            </ol>
          </ul>
          Gerrymandering is a hugely popular sport in US-politics, played by Democrats and Trumpians alike. If
          you want to know more, you can have a look at my website,{" "}
          <a href="https://realfiction.net/2017/01/18/an-outsiders-guide-to-gerrymandering">
            An outsider's guide to gerrymandering
          </a>
        </QAndA>
      </ul>
      <p className="mt-4">Are you ready? Then let's <Link href="/games/0"><a>visit the first game</a></Link></p>
    </div>
  );
}

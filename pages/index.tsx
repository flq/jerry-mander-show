import React from "react";
import Link from "next/link";
import Head from "next/head";
import QAndA from "components/QAndA";
import Star from "components/Star";

export default function Home() {
  return (
    <div className="container mx-auto mt-2 p-0 lg:p-2 flex justify-center flex-col">
      <Head>
        <title>The Jerry Mander Show</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1 className="mx-2 md:mx-0 flex flex-col place-items-center text-2xl lg:text-3xl py-2 lg:py-4 border-2 border-orange-600">
        <div>
          <Star color="BLUE" />
          <Star color="RED" />
          <Star color="BLUE" />
          <Star color="RED" />
          <Star color="BLUE" />
          <Star color="RED" />
        </div>
        <span className="text-center">Welcome to the Jerry Mander Show!</span>
        <div>
          <Star color="BLUE" />
          <Star color="RED" />
          <Star color="BLUE" />
          <Star color="RED" />
          <Star color="BLUE" />
          <Star color="RED" />
        </div>
      </h1>
      <ul className="mt-4">
        <QAndA question="What's the Jerry Mander Show?">
          Gerrymandering is a hugely popular sport in US-politics, played by Democrats and
          Trumpians alike. If you want to know more, you can have a look at my website,{" "}
          <a href="https://realfiction.net/2017/01/18/an-outsiders-guide-to-gerrymandering">
            An outsider's guide to gerrymandering
          </a>
        </QAndA>
        <QAndA question="TL;DR; What are the rules?">
          <ul className="list-disc">
            <li>
              Each game shows a grid with n x n units that either belong to red or blue
            </li>
            <li>
              The description tells you who doesn't have the popular vote. Your job is to
              cut the districts such that you get the mejority of districts anyway.
            </li>
            <li>Hard rules:</li>
            <ol className="list-decimal ml-4">
              <li>Districts must be contiguous</li>
              <li>Each district must have the same amount of units</li>
            </ol>
          </ul>
        </QAndA>
      </ul>
      <p className="mt-4">
        Are you ready? Then let's{" "}
        <Link href="/games/0">
          <a>visit the first game</a>
        </Link>
      </p>
    </div>
  );
}

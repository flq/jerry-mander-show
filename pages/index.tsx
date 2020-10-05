import React from "react";
import Link from "next/link";
import Head from "next/head";
import QAndA from "components/QAndA";
import Star from "components/Star";

export default function Home() {
  return (
    <div className="container mx-auto mt-2 flex justify-center flex-col">
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
          <p>
            The basic premise of Jerry's democracy is: Everything can be boiled down to{" "}
            <strong>black/white, yes/no, left/right</strong>. (<em>Yeah, I know...</em>).
          </p>
          <p>
            Hence, your <strong>constituents</strong> are organized in two tribes,{" "}
            <span className="text-red-700 font-bold">RED</span> or{" "}
            <span className="text-blue-700 font-bold">BLUE</span>.
          </p>
          <p>
            The constituents are organized into <strong>districts</strong>. If either of
            the tribe has a majority in the district, the district falls to that tribe (
            <em>"The winner takes it all 🎶"</em>). It is <strong>up to you</strong> to
            define the districts such that{" "}
            <strong>
              your tribe wins more districts than the opposite tribe, even though it
              doesn't have the popular vote
            </strong>{" "}
            (simply checking to which tribe each constituent belongs).
          </p>
        </QAndA>
        <QAndA question="What are the rules?">
          <ul className="list-disc">
            <li>
              Each game shows an n x n grid full of constituents that are either{" "}
              <span className="text-red-700 font-bold">RED</span> or{" "}
              <span className="text-blue-700 font-bold">BLUE</span>.
            </li>
            <li>
              The description tells you who doesn't have the popular vote. Your job is to
              cut the districts such that you get the majority of districts anyway.
            </li>
            <li>Hard rules:</li>
            <ol className="list-decimal ml-4">
              <li>Districts must be contiguous (no jumps, all parts of the district are connected)</li>
              <li>Each district must have the same amount of constituents</li>
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

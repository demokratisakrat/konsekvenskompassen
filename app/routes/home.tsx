import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  const description =
    "En valkompass som inte bara frågar vad du tycker — den visar vad dina svar kostar, och vem som får betala.";
  return [
    { title: "Valsnack" },
    { name: "description", content: description },
    { property: "og:title", content: "Valsnack" },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    {
      property: "og:image",
      content: "https://valsnack.se/icon-512.png",
    },
    { name: "twitter:card", content: "summary" },
  ];
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        Valsnack
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        En valkompass som inte bara frågar vad du tycker — den visar vad dina
        svar kostar, och vem som får betala.
      </p>
      <p className="mt-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        Den politiska debatten pressar varje fråga mot svart eller vitt. Då
        försvinner platsen där de flesta verkliga avvägningarna faktiskt
        ligger — i ett ärligt "både och". Valsnack är en plats där du kan
        bolla dina tankar inför valet i lugn och ro: ett samtal om vad dina
        åsikter väljer bort, vad de drar igång någon annanstans, och när
        notan kommer — nu eller om tjugo år. Ibland landar den hos dig
        själv.
      </p>
      <Link
        to="/kompass"
        className="mt-6 inline-flex w-fit items-center justify-center rounded-lg bg-gray-900 px-6 py-3 text-base font-semibold text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Starta samtalet
      </Link>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Tar en kvart eller två — du bestämmer själv hur mycket du utvecklar
        dina svar. Det här är en tidig version.
      </p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Sakinnehållet bygger på ett{" "}
        <Link to="/profiler" className="underline underline-offset-2">
          öppet, källbelagt underlag
        </Link>{" "}
        framtaget enligt en{" "}
        <Link to="/metodik" className="underline underline-offset-2">
          publicerad metodik
        </Link>
        , och all kod är{" "}
        <a
          href="https://github.com/demokratisakrat"
          className="underline underline-offset-2"
        >
          öppen källkod
        </a>
        . Dina svar{" "}
        <Link to="/integritet" className="underline underline-offset-2">
          sparas inte
        </Link>{" "}
        kopplade till dig.{" "}
        <Link to="/om" className="underline underline-offset-2">
          Vem står bakom?
        </Link>
      </p>
    </main>
  );
}

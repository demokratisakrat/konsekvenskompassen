import type { ReactNode } from "react";
import { Link } from "react-router";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-8 border-b border-gray-200 pb-5 dark:border-gray-800">
        <Link to="/" className="text-xl font-bold hover:underline">
          Konsekvenskompassen
        </Link>
      </header>
      {children}
      <footer className="mt-12 border-t border-gray-200 pt-5 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          <Link to="/kompass" className="hover:underline">
            Starta kompassen
          </Link>
          <Link to="/profiler" className="hover:underline">
            Kunskapsunderlag
          </Link>
          <Link to="/metodik" className="hover:underline">
            Metodik &amp; källor
          </Link>
          <Link to="/integritet" className="hover:underline">
            Integritet
          </Link>
          <Link to="/om" className="hover:underline">
            Om &amp; kontakt
          </Link>
          <a
            href="https://github.com/demokratisakrat"
            className="hover:underline"
          >
            Öppen källkod (GitHub)
          </a>
        </nav>
      </footer>
    </main>
  );
}

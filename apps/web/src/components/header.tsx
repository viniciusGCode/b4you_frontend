"use client";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-8 py-4">
        <nav className="flex gap-6 text-lg font-semibold tracking-wide font-mono">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              href={to}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
      <hr className="border-border" />
    </div>
  );
}

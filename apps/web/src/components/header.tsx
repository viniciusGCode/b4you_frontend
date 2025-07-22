"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { User, LogOut } from "lucide-react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

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
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              className="bg-primary text-primary-foreground rounded-[var(--radius-sm)] cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button
              asChild
              className="bg-primary text-primary-foreground rounded-[var(--radius-sm)] cursor-pointer"
            >
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
      <hr className="border-border" />
    </div>
  );
}

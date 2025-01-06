"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export function MainNav() {
  const pathname = usePathname();
   const [localStorageUserName] = useLocalStorage(
     "userName",
     "",
     { initializeWithValue: false }
   );

  const [routes, setRoutes] = useState<Array<{ href: string; label: string; active: boolean }>>([]);

  useEffect(() => {
    if (localStorageUserName?.length) {
      setRoutes([
        {
          href: "/",
          label: "Main",
          active: pathname === "/",
        },
        {
          href: "/leaderboard",
          label: "Leaderboard",
          active: pathname === "/leaderboard",
        },
      ]);
    }
  }, [localStorageUserName, pathname]);

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const BREADCRUMBS: Record<string, string[]> = {
  "/": ["CivicPulse", "Dashboard"],
  "/map": ["Beacon", "Map"],
  "/alerts": ["Beacon", "Alerts"],
  "/users": ["Beacon", "Users"],
  "/settings": ["Beacon", "Settings"],
};

export function Topbar() {
  const pathname = usePathname();
  const crumbs = BREADCRUMBS[pathname] ?? ["CivicPulse"];
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      setTime(
        new Date().toLocaleTimeString("en-PH", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-14 flex items-center px-4 gap-4 border-b border-border bg-card shrink-0 z-10">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 min-w-0"
      >
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
            )}
            <span
              className={cn(
                "text-sm font-medium truncate max-w-[120px] sm:max-w-none",
                i === crumbs.length - 1
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Live clock — center (hidden on mobile) */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-foreground font-mono tabular-nums tracking-wider">
            {time}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase leading-none hidden lg:block">
            Calbayog City
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-auto md:ml-0">
        <button
          aria-label="Notifications"
          className="w-8 h-8 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive" />
        </button>
        <div className="w-8 h-8 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary" />
        </div>
      </div>
    </header>
  );
}

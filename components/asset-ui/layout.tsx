"use client";

import { ReactNode, useEffect, useState } from "react";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import { useTheme } from "next-themes";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const storedRole = localStorage.getItem("role");
    const normalizedRole = storedRole ? storedRole.toLowerCase() : null;
    setRole(normalizedRole);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar role={role} />
      <div className="w-full flex flex-1 flex-col">
        <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-white dark:bg-[#0F0F12]">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AdminFooter } from "@/components/layout/admin-footer";

interface AdminShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AdminShell({ children, className }: AdminShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 elo-scrollbar elo-main-surface",
            className
          )}
        >
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}

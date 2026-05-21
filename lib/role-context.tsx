"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import type { AppRole } from "./types";

interface RoleContextValue {
  role: AppRole;
}

const RoleContext = createContext<RoleContextValue>({
  role: "admin",
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Derive role from URL path — no toggle button, role is read-only based on route
  const role: AppRole = pathname.startsWith("/renter") ? "renter" : "admin";

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

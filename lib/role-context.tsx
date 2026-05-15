"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AppRole } from "./types";

interface RoleContextValue {
  role: AppRole;
  setRole: (role: AppRole) => void;
}

const RoleContext = createContext<RoleContextValue>({
  role: "admin",
  setRole: () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<AppRole>("admin");
  const router = useRouter();

  const setRole = useCallback((newRole: AppRole) => {
    setRoleState(newRole);
    router.push(newRole === "admin" ? "/admin/dashboard" : "/renter/dashboard");
  }, [router]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
      <RoleToggle role={role} setRole={setRole} />
    </RoleContext.Provider>
  );
}

function RoleToggle({ role, setRole }: { role: AppRole; setRole: (r: AppRole) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-black text-white text-xs px-3 py-2 rounded-full shadow-lg">
      <span className="opacity-60">View as:</span>
      <button
        onClick={() => setRole("admin")}
        className={`px-2 py-0.5 rounded-full transition-colors ${role === "admin" ? "bg-white text-black font-semibold" : "opacity-60 hover:opacity-100"}`}
      >
        Admin
      </button>
      <span className="opacity-40">|</span>
      <button
        onClick={() => setRole("renter")}
        className={`px-2 py-0.5 rounded-full transition-colors ${role === "renter" ? "bg-white text-black font-semibold" : "opacity-60 hover:opacity-100"}`}
      >
        Renter
      </button>
    </div>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

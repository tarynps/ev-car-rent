"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Truck, Database, FileText, ClipboardList,
  DollarSign, BarChart2, Award, Users, Settings,
  User, Search, CreditCard, Bell, Menu, X, Zap, Activity,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { notifications } from "@/lib/mock-data";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inventory", label: "Inventory", icon: Truck },
  { href: "/admin/models", label: "Models", icon: Database },
  { href: "/admin/contracts", label: "Contracts", icon: FileText },
  { href: "/admin/requests", label: "Requests", icon: ClipboardList },
  { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
  { href: "/admin/finance", label: "Finance", icon: BarChart2 },
  { href: "/admin/purchase-offers", label: "Purchase Offers", icon: Award },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const renterNav = [
  { href: "/renter/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/renter/vehicles", label: "Vehicle Catalog", icon: Search },
  { href: "/renter/fleet", label: "My Fleet", icon: Truck },
  { href: "/renter/telematics", label: "Telematics", icon: Activity },
  { href: "/renter/billing", label: "Billing", icon: CreditCard },
  { href: "/renter/account", label: "Account", icon: User },
];

export default function AppShell({ children, variant }: { children: React.ReactNode; variant: "admin" | "renter" }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const nav = variant === "admin" ? adminNav : renterNav;
  const unread = notifications.filter((n) => !n.read).length;
  const isRenter = variant === "renter";
  const pendingRequests = 2;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-ev-black">
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-ev-primary flex items-center justify-center">
            {isRenter ? <Zap size={14} className="text-white" /> : <Truck size={14} className="text-white" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {isRenter ? "EV Drive" : "EV Fleet"}
            </p>
            <p className="text-xs text-white/50">
              {isRenter ? "Renter Portal" : "Admin Portal"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && href !== "/renter/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
                active
                  ? "bg-ev-primary-tint border-l-2 border-ev-primary text-ev-primary font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              {label === "Requests" && pendingRequests > 0 && (
                <span className="ml-auto text-xs bg-orange-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {pendingRequests}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <User size={14} className="text-white/60" />
          </div>
          <div>
            <p className="text-xs font-medium text-white">
              {isRenter ? "Natthapong C." : "Natthapong C."}
            </p>
            <p className="text-xs text-white/50">
              {isRenter ? "Renter Admin" : "Super Admin"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-56 flex flex-col z-50">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-ev-surface border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1 text-ev-muted hover:text-ev-black" onClick={() => setSidebarOpen(true)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="text-xs text-ev-muted hidden sm:block">
              {isRenter ? "Renter Portal" : "Admin Portal"} — EV Fleet Management
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isRenter && (
              <div className="relative" ref={notifRef}>
                <button
                  className="relative p-1.5 text-ev-muted hover:text-ev-black transition-colors"
                  onClick={() => setNotifOpen((v) => !v)}
                >
                  <Bell size={18} />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-ev-primary text-white text-[9px] rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-9 w-80 bg-ev-surface border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-ev-black">Notifications</span>
                      {unread > 0 && (
                        <button className="text-xs text-ev-primary hover:underline">Mark all as read</button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {notifications.map((n) => (
                        <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? "bg-ev-primary-tint/40" : ""}`}>
                          <div className="flex items-start gap-2">
                            {!n.read && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ev-primary shrink-0" />}
                            {n.read && <span className="mt-1.5 w-1.5 h-1.5 shrink-0" />}
                            <div>
                              <p className="text-xs font-medium text-ev-black">{n.title}</p>
                              <p className="text-xs text-ev-muted mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-ev-muted mt-1">{n.createdAt}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-ev-bg p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

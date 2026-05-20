"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, Database, CalendarCheck, CheckSquare,
  DollarSign, BarChart2, RefreshCw, Building, Settings,
  User, Search, BookOpen, CreditCard, Bell, Menu, X, Zap,
} from "lucide-react";
import { useState } from "react";
import { notifications } from "@/lib/mock-data";

const adminNav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/fleet", label: "Inventory Management", icon: Car },
  { href: "/admin/models", label: "Models", icon: Database },
  { href: "/admin/contracts", label: "Contracts", icon: CalendarCheck },
  { href: "/admin/requests", label: "Requests", icon: CheckSquare },
  { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
  { href: "/admin/finance", label: "Finance", icon: BarChart2 },
  { href: "/admin/rent-to-sell", label: "Rent-to-Sell", icon: RefreshCw },
  { href: "/admin/companies", label: "Clients", icon: Building },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const renterNav = [
  { href: "/renter/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/renter/vehicles", label: "Vehicle Catalog", icon: Search },
  { href: "/renter/bookings", label: "My Fleet", icon: BookOpen },
  { href: "/renter/billing", label: "Billing", icon: CreditCard },
  { href: "/renter/account", label: "Account", icon: User },
  { href: "/renter/notifications", label: "Notifications", icon: Bell },
];

export default function AppShell({ children, variant }: { children: React.ReactNode; variant: "admin" | "renter" }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = variant === "admin" ? adminNav : renterNav;
  const unread = notifications.filter((n) => !n.read).length;
  const isRenter = variant === "renter";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className={`px-6 py-5 border-b ${isRenter ? "border-slate-700/50" : "border-gray-100"}`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-tertiary">
            {isRenter ? <Zap size={14} className="text-white" /> : <Car size={14} className="text-white" />}
          </div>
          <div>
            <p className={`text-sm font-semibold ${isRenter ? "text-white" : "text-gray-900"}`}>
              {isRenter ? "EV Drive" : "EV Fleet"}
            </p>
            <p className={`text-xs ${isRenter ? "text-slate-400" : "text-gray-500"}`}>
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
                isRenter
                  ? active
                    ? "bg-tertiary-tint text-tertiary font-medium"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : active
                    ? "bg-tertiary-tint text-tertiary font-medium"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
              {label === "Notifications" && unread > 0 && (
                <span className="ml-auto text-xs rounded-full w-4 h-4 flex items-center justify-center text-white bg-tertiary">
                  {unread}
                </span>
              )}
              {label === "Requests" && (
                <span className="ml-auto text-xs text-white rounded-full w-4 h-4 flex items-center justify-center bg-tertiary">2</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`px-4 py-4 border-t ${isRenter ? "border-slate-700/50" : "border-gray-100"}`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isRenter ? "bg-slate-700" : "bg-gray-100"}`}>
            <User size={14} className={isRenter ? "text-slate-300" : "text-gray-500"} />
          </div>
          <div>
            <p className={`text-xs font-medium ${isRenter ? "text-white" : "text-gray-900"}`}>
              {isRenter ? "Siriporn W." : "Natthapong C."}
            </p>
            <p className={`text-xs ${isRenter ? "text-slate-400" : "text-gray-500"}`}>
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
      <aside className={`hidden lg:flex flex-col w-56 shrink-0 ${isRenter ? "bg-slate-900" : "bg-white border-r border-gray-100"}`}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className={`relative w-56 flex flex-col z-50 ${isRenter ? "bg-slate-900" : "bg-white border-r border-gray-100"}`}>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1 text-gray-500 hover:text-gray-900" onClick={() => setSidebarOpen(true)}>
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="text-xs text-gray-500 hidden sm:block">
              {isRenter ? "Renter Portal" : "Admin Portal"} — EV Fleet Management
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isRenter && (
              <Link href="/renter/notifications" className="relative p-1.5 text-gray-500 hover:text-gray-900 transition-colors">
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 text-white text-[9px] rounded-full flex items-center justify-center bg-tertiary">
                    {unread}
                  </span>
                )}
              </Link>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-neutral p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

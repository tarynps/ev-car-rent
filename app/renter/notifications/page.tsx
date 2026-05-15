"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, RefreshCw, FileText, AlertTriangle, Bell } from "lucide-react";
import { notifications as initialNotifications } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { AppNotification } from "@/lib/types";

const iconMap = {
  approval: <CheckCircle size={16} className="text-green-500 shrink-0" />,
  rejection: <XCircle size={16} className="text-red-500 shrink-0" />,
  reminder: <Clock size={16} className="text-orange-400 shrink-0" />,
  invoice: <FileText size={16} className="text-blue-500 shrink-0" />,
  contract: <AlertTriangle size={16} className="text-yellow-500 shrink-0" />,
  conversion: <RefreshCw size={16} className="text-tertiary shrink-0" />,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary flex items-center gap-2">
            <Bell size={20} />
            Notifications
            {unread > 0 && <span className="bg-tertiary text-white text-xs rounded-full px-2 py-0.5">{unread}</span>}
          </h1>
          <p className="text-sm text-secondary mt-0.5">{notifications.length} total · {unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-xs text-tertiary hover:underline">Mark all as read</button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
            <Bell size={28} className="text-gray-300 mx-auto mb-3" />
            <p className="text-secondary text-sm">No notifications yet.</p>
          </div>
        ) : notifications.map((n: AppNotification) => (
          <div key={n.id}
            className={`bg-white rounded-xl border shadow-sm p-4 flex items-start gap-3 transition-colors ${!n.read ? "border-gray-200" : "border-gray-100 opacity-70"}`}>
            <div className="mt-0.5">{iconMap[n.type]}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className={`text-sm ${!n.read ? "font-semibold text-primary" : "font-medium text-primary"}`}>{n.title}</p>
                  <p className="text-xs text-secondary mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.createdAt}</p>
                </div>
                {!n.read && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary shrink-0" />
                    <button onClick={() => markRead(n.id)} className="text-xs text-secondary hover:text-primary whitespace-nowrap">Mark read</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

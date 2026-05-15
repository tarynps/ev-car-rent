"use client";

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, unknown>>({ columns, data, pageSize = 10, emptyMessage = "No records found" }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey as keyof T];
      const bv = b[sortKey as keyof T];
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const pageCount = Math.ceil(sorted.length / pageSize);
  const pageData = sorted.slice(page * pageSize, (page + 1) * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th key={String(col.key)} className="text-left px-4 py-3 text-xs font-medium text-secondary uppercase tracking-wide whitespace-nowrap">
                  {col.sortable !== false ? (
                    <button className="flex items-center gap-1 hover:text-primary transition-colors" onClick={() => toggleSort(String(col.key))}>
                      {col.header}
                      {sortKey === String(col.key) ? (
                        sortDir === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                      ) : (
                        <ChevronsUpDown size={13} className="opacity-40" />
                      )}
                    </button>
                  ) : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-secondary text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : pageData.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-3 text-primary whitespace-nowrap">
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-between px-1 py-3 text-sm text-secondary">
          <span>{sorted.length} records</span>
          <div className="flex items-center gap-1">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="px-2">{page + 1} / {pageCount}</span>
            <button disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

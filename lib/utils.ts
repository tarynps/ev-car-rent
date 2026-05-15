export function formatBaht(amount: number): string {
  return `฿${amount.toLocaleString("th-TH")}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const d = date.getDate().toString().padStart(2, "0");
  const m = months[date.getMonth()];
  const y = date.getFullYear();
  return `${d} ${m} ${y}`;
}

export function daysBetween(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
}

export function daysUntil(dateStr: string): number {
  const now = new Date("2026-05-15");
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

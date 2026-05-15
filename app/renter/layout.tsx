import AppShell from "@/components/AppShell";

export default function RenterLayout({ children }: { children: React.ReactNode }) {
  return <AppShell variant="renter">{children}</AppShell>;
}

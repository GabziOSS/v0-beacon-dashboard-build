import { AppShell } from "@/components/app-shell"

export default function MapLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}

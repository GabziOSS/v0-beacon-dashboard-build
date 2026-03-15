import { DashboardTabs } from "@beacon/dashboard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col">
      <DashboardTabs />
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  )
}

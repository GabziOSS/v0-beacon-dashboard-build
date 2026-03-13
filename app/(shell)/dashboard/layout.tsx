import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <DashboardTabs />
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  )
}

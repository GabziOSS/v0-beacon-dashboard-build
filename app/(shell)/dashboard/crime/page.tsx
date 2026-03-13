import { DashboardGrid } from '@/components/dashboard/dashboard-grid'

export const dynamic = 'force-dynamic'

export default function CrimeDashboard() {
  return <DashboardGrid initialPreset="crime" />
}

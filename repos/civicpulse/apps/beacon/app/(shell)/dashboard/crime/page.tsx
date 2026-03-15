import { DashboardGrid } from "@beacon/dashboard"

export const dynamic = "force-dynamic"

export default function CrimeDashboard() {
  return <DashboardGrid initialPreset="crime" />
}

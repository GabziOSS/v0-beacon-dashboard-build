import { IncidentTable } from "@/components/dashboard/incident-table"

export default function TablePage() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-semibold text-foreground">Live Incidents</h2>
        <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 border border-border rounded-sm bg-card-nested">
          8 records
        </span>
      </div>
      <IncidentTable />
    </section>
  )
}

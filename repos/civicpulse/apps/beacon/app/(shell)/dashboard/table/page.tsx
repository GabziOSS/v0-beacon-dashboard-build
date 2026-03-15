import { IncidentTable } from "@beacon/dashboard"

export default function TablePage() {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-foreground">
          Live Incidents
        </h2>
        <span className="bg-card-nested rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          8 records
        </span>
      </div>
      <IncidentTable />
    </section>
  )
}

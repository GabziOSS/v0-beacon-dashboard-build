"use client"

import { useState, useTransition } from "react"
import { X, MapPin, Clock, AlertTriangle, Users, FileText, Radio } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const TABS = ["Details", "Timeline", "Log Incident"] as const
type Tab = typeof TABS[number]

const MINI_STATS = [
  { label: "Active",    value: "3",   color: "text-destructive" },
  { label: "Responding",value: "5",  color: "text-warning"     },
  { label: "Resolved",  value: "47", color: "text-success"     },
  { label: "Risk Score",value: "72", color: "text-chart-1"     },
]

const TIMELINE_ENTRIES = [
  { type: "Fire",     severity: "Critical", time: "2025-03-08T06:32:00", desc: "Structure fire at Maharlika Hwy." },
  { type: "Flood",    severity: "High",     time: "2025-03-08T05:45:00", desc: "Rising waters near riverbank." },
  { type: "Medical",  severity: "Medium",   time: "2025-03-07T22:10:00", desc: "Mass casualty — vehicular incident." },
  { type: "Crime",    severity: "Low",      time: "2025-03-07T18:30:00", desc: "Robbery. Suspects at large." },
  { type: "Typhoon",  severity: "Critical", time: "2025-03-07T14:00:00", desc: "Typhoon Rosita landfall warning." },
]

const SEV_COLORS = {
  Critical: "text-destructive",
  High: "text-warning",
  Medium: "text-chart-1",
  Low: "text-success",
}

export function ZoneSheet({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("Details")
  const [, startTransition] = useTransition()
  const [form, setForm] = useState({
    type: "Fire",
    severity: "High",
    location: "",
    description: "",
    responders: 4,
    status: "Active",
  })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => setSubmitted(true))
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="fixed right-0 top-0 bottom-0 z-50 w-[420px] bg-card border-l border-border shadow-2xl flex flex-col">
      {/* Sheet header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">Poblacion Zone</p>
            <p className="text-[10px] font-mono text-muted-foreground">12.0730° N, 124.0070° E</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close sheet"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2.5 text-xs font-medium transition-colors",
              tab === t
                ? "text-primary border-b border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "Details" && (
          <div className="p-4 space-y-4">
            {/* Mini stat grid */}
            <div className="grid grid-cols-2 gap-2">
              {MINI_STATS.map(s => (
                <div
                  key={s.label}
                  className="bg-card-nested border border-border rounded-sm p-3 flex flex-col gap-1"
                >
                  <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                    {s.label}
                  </span>
                  <span className={cn("text-2xl font-semibold font-mono tabular-nums leading-none", s.color)}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Placeholder chart area */}
            <div className="bg-card-nested border border-border rounded-sm p-4 h-32 flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground font-mono">
                Zone trend chart renders here
              </span>
            </div>

            {/* Zone info */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-muted-foreground">District</span>
                <span className="text-foreground font-mono">District I</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-muted-foreground">Area</span>
                <span className="text-foreground font-mono">8.2 km²</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-muted-foreground">Population</span>
                <span className="text-foreground font-mono">28,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alert Level</span>
                <span className="text-destructive font-mono font-medium">ALERT 3</span>
              </div>
            </div>
          </div>
        )}

        {tab === "Timeline" && (
          <div className="p-4 space-y-3">
            {TIMELINE_ENTRIES.map((entry, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0 mt-1",
                    SEV_COLORS[entry.severity as keyof typeof SEV_COLORS].replace("text-", "bg-")
                  )} />
                  {i < TIMELINE_ENTRIES.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn("text-[10px] font-semibold font-mono", SEV_COLORS[entry.severity as keyof typeof SEV_COLORS])}>
                      {entry.type}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">
                      {format(new Date(entry.time), "MM/dd HH:mm")}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{entry.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Log Incident" && (
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                Type
              </label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-2.5 py-1.5 bg-input border border-border rounded-sm text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                {["Fire","Flood","Crime","Medical","Infrastructure","Typhoon"].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                Severity
              </label>
              <div className="flex gap-2">
                {["Critical","High","Medium","Low"].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, severity: s }))}
                    className={cn(
                      "flex-1 py-1.5 text-[10px] font-mono rounded-sm border transition-colors",
                      form.severity === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                Location
              </label>
              <input
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Street, landmark, barangay..."
                className="w-full px-2.5 py-1.5 bg-input border border-border rounded-sm text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Describe the incident..."
                className="w-full px-2.5 py-1.5 bg-input border border-border rounded-sm text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  Responders
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.responders}
                  onChange={e => setForm(f => ({ ...f, responders: Number(e.target.value) }))}
                  className="w-full px-2.5 py-1.5 bg-input border border-border rounded-sm text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-2.5 py-1.5 bg-input border border-border rounded-sm text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  {["Active","Responding","Contained","Resolved"].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className={cn(
                "w-full py-2 text-xs font-semibold rounded-sm transition-colors",
                submitted
                  ? "bg-success/15 text-success border border-success/30"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {submitted ? "Incident Logged" : "Submit Incident"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

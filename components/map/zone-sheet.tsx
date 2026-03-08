"use client"

import { useState, useTransition } from "react"
import {
  X, MapPin, AlertTriangle, Users, CheckCircle, Edit, UserPlus,
  TrendingUp, Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import type { Zone, RiskLevel } from "./city-map"
import { useIncidents } from "@/lib/hooks"

const TABS = ["Details", "Incidents", "Log Incident"] as const
type Tab = typeof TABS[number]

const RISK_TEXT: Record<RiskLevel, string> = {
  Critical: "text-destructive",
  High:     "text-warning",
  Medium:   "text-chart-1",
  Low:      "text-success",
  Minimal:  "text-muted-foreground",
}

const RISK_BG: Record<RiskLevel, string> = {
  Critical: "bg-destructive/10 border-destructive/20",
  High:     "bg-warning/10 border-warning/20",
  Medium:   "bg-chart-1/10 border-chart-1/20",
  Low:      "bg-success/10 border-success/20",
  Minimal:  "bg-muted border-border",
}

const SEV_TEXT: Record<string, string> = {
  Critical: "text-destructive",
  High:     "text-warning",
  Medium:   "text-chart-1",
  Low:      "text-success",
}

const SEV_DOT: Record<string, string> = {
  Critical: "bg-destructive",
  High:     "bg-warning",
  Medium:   "bg-chart-1",
  Low:      "bg-success",
}

const STATUS_COLORS: Record<string, string> = {
  Active:     "bg-destructive/10 text-destructive border-destructive/20",
  Responding: "bg-warning/10 text-warning border-warning/20",
  Contained:  "bg-chart-6/10 text-chart-6 border-chart-6/20",
  Resolved:   "bg-success/10 text-success border-success/20",
}

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium font-mono border", className)}>
      {label}
    </span>
  )
}

interface ZoneSheetProps {
  zone: Zone
  onClose: () => void
}

export function ZoneSheet({ zone, onClose }: ZoneSheetProps) {
  const [tab, setTab] = useState<Tab>("Details")
  const [, startTransition] = useTransition()
  const { data: allIncidents } = useIncidents()
  const zoneIncidents = allIncidents.filter(i =>
    i.zone.toLowerCase().includes(zone.label.split(" ")[0].toLowerCase())
  )

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

  const alertLevel = zone.risk === "Critical" ? "ALERT 3"
    : zone.risk === "High" ? "ALERT 2"
    : zone.risk === "Medium" ? "ALERT 1"
    : "NORMAL"

  return (
    <div className="fixed right-0 top-0 bottom-0 z-50 w-[420px] bg-card border-l border-border shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn("w-8 h-8 rounded-sm border flex items-center justify-center shrink-0", RISK_BG[zone.risk])}>
            <MapPin className={cn("w-4 h-4", RISK_TEXT[zone.risk])} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight truncate">{zone.label}</p>
            <p className="text-[10px] font-mono text-muted-foreground">{zone.district} · {zone.population.toLocaleString()} pop.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-semibold border",
            RISK_BG[zone.risk], RISK_TEXT[zone.risk]
          )}>
            {alertLevel}
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Close zone sheet"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
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
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
            {t === "Incidents" && zoneIncidents.length > 0 && (
              <span className="ml-1.5 text-[9px] font-mono bg-secondary text-muted-foreground px-1 py-0.5 rounded-sm">
                {zoneIncidents.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Details ── */}
        {tab === "Details" && (
          <div className="p-4 space-y-4">
            {/* KPI grid */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Active",      value: zone.activeIncidents, color: zone.activeIncidents > 0 ? "text-destructive" : "text-success" },
                { label: "Risk Score",  value: zone.risk === "Critical" ? 85 : zone.risk === "High" ? 68 : zone.risk === "Medium" ? 45 : 18, color: RISK_TEXT[zone.risk] },
                { label: "Population",  value: zone.population.toLocaleString(), color: "text-chart-1" },
                { label: "Responders",  value: zoneIncidents.reduce((s, i) => s + i.responders, 0), color: "text-foreground" },
              ].map(kpi => (
                <div key={kpi.label} className="bg-card-nested border border-border rounded-sm p-3">
                  <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">{kpi.label}</p>
                  <p className={cn("text-2xl font-semibold font-mono tabular-nums leading-tight mt-1", kpi.color)}>
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Risk bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Risk Breakdown</p>
                <span className={cn("text-[10px] font-mono font-semibold", RISK_TEXT[zone.risk])}>{zone.risk}</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "Fire",      val: zone.risk === "Critical" ? 88 : zone.risk === "High" ? 65 : 30 },
                  { label: "Flood",     val: zone.risk === "Critical" ? 75 : zone.risk === "High" ? 80 : 20 },
                  { label: "Crime",     val: zone.risk === "Critical" ? 60 : zone.risk === "High" ? 55 : 35 },
                  { label: "Medical",   val: zone.risk === "Critical" ? 70 : zone.risk === "High" ? 50 : 45 },
                ].map(bar => (
                  <div key={bar.label} className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-16 shrink-0">{bar.label}</span>
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", RISK_TEXT[zone.risk].replace("text-", "bg-"))}
                        style={{ width: `${bar.val}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{bar.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone metadata */}
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-2">Zone Info</p>
              {[
                { label: "District",     value: zone.district },
                { label: "Area",         value: `${(zone.population / 3000).toFixed(1)} km²` },
                { label: "Barangays",    value: Math.round(zone.population / 4500) + " units" },
                { label: "Alert Level",  value: alertLevel },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center border-b border-border pb-1.5 text-xs">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={cn(
                    "font-mono",
                    row.label === "Alert Level" ? RISK_TEXT[zone.risk] + " font-medium" : "text-foreground"
                  )}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Incidents ── */}
        {tab === "Incidents" && (
          <div className="p-4 space-y-2">
            {zoneIncidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <CheckCircle className="w-8 h-8 text-success/50" />
                <p className="text-xs text-muted-foreground font-mono">No incidents logged for this zone</p>
              </div>
            ) : (
              zoneIncidents.map(inc => (
                <div key={inc.id} className="bg-card-nested border border-border rounded-sm p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground">{inc.id}</span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {format(new Date(inc.timestamp), "MM/dd HH:mm")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge label={inc.type} className={`bg-card text-foreground border-border`} />
                    <Badge label={inc.severity} className={`bg-${SEV_DOT[inc.severity]?.replace("bg-", "") || "muted"}/10 ${SEV_TEXT[inc.severity]} border-border`} />
                    <Badge label={inc.status} className={STATUS_COLORS[inc.status]} />
                  </div>
                  <p className="text-[11px] text-foreground leading-relaxed line-clamp-2">{inc.description}</p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />{inc.responders} resp.
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />{inc.duration}m
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <MapPin className="w-3 h-3" />{inc.barangay}
                    </span>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <ActionBtn icon={<Edit className="w-3 h-3" />} label="Edit" />
                    <ActionBtn icon={<UserPlus className="w-3 h-3" />} label="Assign" />
                    <ActionBtn icon={<CheckCircle className="w-3 h-3" />} label="Resolve" accent />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Log Incident ── */}
        {tab === "Log Incident" && (
          <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Type</label>
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
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Severity</label>
              <div className="flex gap-1.5">
                {["Critical","High","Medium","Low"].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, severity: s }))}
                    className={cn(
                      "flex-1 py-1.5 text-[10px] font-mono rounded-sm border transition-colors",
                      form.severity === s
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Zone</label>
              <input
                value={zone.label}
                readOnly
                className="w-full px-2.5 py-1.5 bg-secondary border border-border rounded-sm text-xs font-mono text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Location / Landmark</label>
              <input
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Street, barangay, landmark..."
                className="w-full px-2.5 py-1.5 bg-input border border-border rounded-sm text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Description</label>
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
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Responders</label>
                <input
                  type="number"
                  min={1}
                  value={form.responders}
                  onChange={e => setForm(f => ({ ...f, responders: Number(e.target.value) }))}
                  className="w-full px-2.5 py-1.5 bg-input border border-border rounded-sm text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Status</label>
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

function ActionBtn({ icon, label, accent = false }: { icon: React.ReactNode; label: string; accent?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-medium border transition-colors",
        accent
          ? "border-success/30 text-success bg-success/10 hover:bg-success/20"
          : "border-border text-muted-foreground bg-card hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  )
}

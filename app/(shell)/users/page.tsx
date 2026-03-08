"use client"

import { useState } from "react"
import { Search, Filter, Plus, MoreHorizontal, X, Mail, Phone, MapPin, Shield, Edit2, Trash2, Key } from "lucide-react"
import { cn } from "@/lib/utils"

type Role = "admin" | "analyst" | "responder" | "viewer"
type Status = "active" | "inactive"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: Role
  status: Status
  avatar: string
  zones: string[]
  lastActive: Date
}

const ROLE_COLORS: Record<Role, string> = {
  admin: "text-destructive bg-destructive-dim",
  analyst: "text-accent bg-accent-dim",
  responder: "text-primary bg-primary-dim",
  viewer: "text-muted-foreground bg-muted",
}

const STATUS_COLORS: Record<Status, { dot: string; text: string }> = {
  active: { dot: "bg-success", text: "text-success" },
  inactive: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
}

const ZONE_NAMES: Record<string, string> = {
  z01: "Poblacion Central",
  z02: "Bagacay District",
  z03: "Calbayog Port Area",
  z04: "Nijaga–San Policarpo",
}

const MOCK_USERS: User[] = [
  { id: "usr_001", name: "E. Coordinador", email: "coordinator@cdrrmo.gov.ph", phone: "+63 917 123 4567", role: "admin", status: "active", avatar: "EC", zones: ["z01", "z02", "z03", "z04"], lastActive: new Date(Date.now() - 5 * 60000) },
  { id: "usr_002", name: "Maria Santos", email: "m.santos@cdrrmo.gov.ph", phone: "+63 918 234 5678", role: "analyst", status: "active", avatar: "MS", zones: ["z01", "z02"], lastActive: new Date(Date.now() - 15 * 60000) },
  { id: "usr_003", name: "Juan Dela Cruz", email: "j.delacruz@cdrrmo.gov.ph", phone: "+63 919 345 6789", role: "responder", status: "active", avatar: "JD", zones: ["z03"], lastActive: new Date(Date.now() - 32 * 60000) },
  { id: "usr_004", name: "Ana Reyes", email: "a.reyes@cdrrmo.gov.ph", phone: "+63 920 456 7890", role: "responder", status: "active", avatar: "AR", zones: ["z02", "z04"], lastActive: new Date(Date.now() - 45 * 60000) },
  { id: "usr_005", name: "Pedro Garcia", email: "p.garcia@cdrrmo.gov.ph", phone: "+63 921 567 8901", role: "responder", status: "active", avatar: "PG", zones: ["z01"], lastActive: new Date(Date.now() - 58 * 60000) },
  { id: "usr_006", name: "Rosa Flores", email: "r.flores@cdrrmo.gov.ph", phone: "+63 922 678 9012", role: "analyst", status: "active", avatar: "RF", zones: ["z03", "z04"], lastActive: new Date(Date.now() - 72 * 60000) },
  { id: "usr_007", name: "Carlos Mendoza", email: "c.mendoza@cdrrmo.gov.ph", phone: "+63 923 789 0123", role: "viewer", status: "active", avatar: "CM", zones: ["z01", "z02", "z03", "z04"], lastActive: new Date(Date.now() - 95 * 60000) },
  { id: "usr_008", name: "Elena Torres", email: "e.torres@cdrrmo.gov.ph", phone: "+63 924 890 1234", role: "responder", status: "inactive", avatar: "ET", zones: ["z02"], lastActive: new Date(Date.now() - 3 * 86400000) },
  { id: "usr_009", name: "Miguel Ramos", email: "m.ramos@cdrrmo.gov.ph", phone: "+63 925 901 2345", role: "responder", status: "active", avatar: "MR", zones: ["z04"], lastActive: new Date(Date.now() - 125 * 60000) },
  { id: "usr_010", name: "Lucia Aquino", email: "l.aquino@cdrrmo.gov.ph", phone: "+63 926 012 3456", role: "viewer", status: "inactive", avatar: "LA", zones: ["z01"], lastActive: new Date(Date.now() - 7 * 86400000) },
]

function formatLastActive(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filtered = MOCK_USERS
    .filter(u => roleFilter === "all" || u.role === roleFilter)
    .filter(u => {
      if (!search) return true
      const q = search.toLowerCase()
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    })

  const counts = {
    admin: MOCK_USERS.filter(u => u.role === "admin").length,
    analyst: MOCK_USERS.filter(u => u.role === "analyst").length,
    responder: MOCK_USERS.filter(u => u.role === "responder").length,
    viewer: MOCK_USERS.filter(u => u.role === "viewer").length,
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Users</h1>
        <button className="h-9 px-4 text-xs font-medium rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Add User
        </button>
      </div>

      {/* Role pills */}
      <div className="flex flex-wrap gap-2">
        {(["admin", "analyst", "responder", "viewer"] as Role[]).map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors border",
              roleFilter === role ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary"
            )}
          >
            <span className={cn("px-1.5 py-0.5 rounded-sm text-[10px] font-semibold uppercase", ROLE_COLORS[role])}>
              {counts[role]}
            </span>
            <span className="capitalize text-foreground">{role}s</span>
          </button>
        ))}
      </div>

      {/* Search & filter */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-sm bg-input border border-border rounded-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="h-9 px-3 text-xs font-medium rounded-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Zone
        </button>
        <button className="h-9 px-3 text-xs font-medium rounded-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          Status
        </button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card-nested">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">User</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Zones</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Last Active</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/50 cursor-pointer transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-semibold text-primary font-mono">{user.avatar}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase", ROLE_COLORS[user.role])}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{user.zones.length} zone{user.zones.length !== 1 ? "s" : ""}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_COLORS[user.status].dot)} />
                      <span className={cn("text-xs capitalize", STATUS_COLORS[user.status].text)}>{user.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">{formatLastActive(user.lastActive)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); setSelectedUser(user) }}
                      className="w-6 h-6 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No users match your criteria</p>
          </div>
        )}
      </div>

      {/* User detail sheet */}
      {selectedUser && (
        <UserSheet user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}

function UserSheet({ user, onClose }: { user: User; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/60 z-40" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold text-foreground">User Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-sm bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xl font-semibold text-primary font-mono">{user.avatar}</span>
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-foreground truncate">{user.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase", ROLE_COLORS[user.role])}>
                  {user.role}
                </span>
                <div className="flex items-center gap-1">
                  <span className={cn("w-1.5 h-1.5 rounded-full", STATUS_COLORS[user.status].dot)} />
                  <span className={cn("text-xs capitalize", STATUS_COLORS[user.status].text)}>{user.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Zones */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground">Assigned Zones</h3>
            <div className="space-y-2">
              {user.zones.map(z => (
                <div key={z} className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-mono text-xs text-muted-foreground w-8">{z}</span>
                  <span className="text-foreground">{ZONE_NAMES[z] || z}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground">Permissions</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              {user.role === "admin" && (
                <>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Full system access</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> User management</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Settings configuration</div>
                </>
              )}
              {user.role === "analyst" && (
                <>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> View all dashboards</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Create reports</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Export data</div>
                </>
              )}
              {user.role === "responder" && (
                <>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> View assigned zones</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Update incident status</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Submit reports</div>
                </>
              )}
              {user.role === "viewer" && (
                <>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Read-only access</div>
                  <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> View public dashboards</div>
                </>
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground">Activity</h3>
            <p className="text-xs text-muted-foreground">Last active: {formatLastActive(user.lastActive)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
          <button className="flex-1 h-9 text-xs font-medium rounded-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-1.5">
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <button className="flex-1 h-9 text-xs font-medium rounded-sm border border-border bg-card text-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-1.5">
            <Key className="w-3.5 h-3.5" />
            Reset Password
          </button>
          <button className="h-9 px-3 text-xs font-medium rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center gap-1.5">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  )
}

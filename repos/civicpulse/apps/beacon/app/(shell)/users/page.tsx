"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  X,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit2,
  Trash2,
  Key,
} from "lucide-react"
import { cn } from "@beacon/ui"

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
  {
    id: "usr_000",
    name: "Dr. R. Ortiz",
    email: "riz.rupert.ortiz@nwssu.edu.ph",
    phone: "+63 917 123 4567",
    role: "admin",
    status: "active",
    avatar: "RZ",
    zones: ["z01", "z02", "z03", "z04"],
    lastActive: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "usr_001",
    name: "E. Coordinador",
    email: "coordinator@cdrrmo.gov.ph",
    phone: "+63 917 123 4567",
    role: "admin",
    status: "active",
    avatar: "EC",
    zones: ["z01", "z02", "z03", "z04"],
    lastActive: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "usr_002",
    name: "Maria Santos",
    email: "m.santos@cdrrmo.gov.ph",
    phone: "+63 918 234 5678",
    role: "analyst",
    status: "active",
    avatar: "MS",
    zones: ["z01", "z02"],
    lastActive: new Date(Date.now() - 15 * 60000),
  },
  {
    id: "usr_003",
    name: "Juan Dela Cruz",
    email: "j.delacruz@cdrrmo.gov.ph",
    phone: "+63 919 345 6789",
    role: "responder",
    status: "active",
    avatar: "JD",
    zones: ["z03"],
    lastActive: new Date(Date.now() - 32 * 60000),
  },
  {
    id: "usr_004",
    name: "Ana Reyes",
    email: "a.reyes@cdrrmo.gov.ph",
    phone: "+63 920 456 7890",
    role: "responder",
    status: "active",
    avatar: "AR",
    zones: ["z02", "z04"],
    lastActive: new Date(Date.now() - 45 * 60000),
  },
  {
    id: "usr_005",
    name: "Pedro Garcia",
    email: "p.garcia@cdrrmo.gov.ph",
    phone: "+63 921 567 8901",
    role: "responder",
    status: "active",
    avatar: "PG",
    zones: ["z01"],
    lastActive: new Date(Date.now() - 58 * 60000),
  },
  {
    id: "usr_006",
    name: "Rosa Flores",
    email: "r.flores@cdrrmo.gov.ph",
    phone: "+63 922 678 9012",
    role: "analyst",
    status: "active",
    avatar: "RF",
    zones: ["z03", "z04"],
    lastActive: new Date(Date.now() - 72 * 60000),
  },
  {
    id: "usr_007",
    name: "Carlos Mendoza",
    email: "c.mendoza@cdrrmo.gov.ph",
    phone: "+63 923 789 0123",
    role: "viewer",
    status: "active",
    avatar: "CM",
    zones: ["z01", "z02", "z03", "z04"],
    lastActive: new Date(Date.now() - 95 * 60000),
  },
  {
    id: "usr_008",
    name: "Elena Torres",
    email: "e.torres@cdrrmo.gov.ph",
    phone: "+63 924 890 1234",
    role: "responder",
    status: "inactive",
    avatar: "ET",
    zones: ["z02"],
    lastActive: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: "usr_009",
    name: "Miguel Ramos",
    email: "m.ramos@cdrrmo.gov.ph",
    phone: "+63 925 901 2345",
    role: "responder",
    status: "active",
    avatar: "MR",
    zones: ["z04"],
    lastActive: new Date(Date.now() - 125 * 60000),
  },
  {
    id: "usr_010",
    name: "Lucia Aquino",
    email: "l.aquino@cdrrmo.gov.ph",
    phone: "+63 926 012 3456",
    role: "viewer",
    status: "inactive",
    avatar: "LA",
    zones: ["z01"],
    lastActive: new Date(Date.now() - 7 * 86400000),
  },
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

  const filtered = MOCK_USERS.filter(
    (u) => roleFilter === "all" || u.role === roleFilter
  ).filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  const counts = {
    admin: MOCK_USERS.filter((u) => u.role === "admin").length,
    analyst: MOCK_USERS.filter((u) => u.role === "analyst").length,
    responder: MOCK_USERS.filter((u) => u.role === "responder").length,
    viewer: MOCK_USERS.filter((u) => u.role === "viewer").length,
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Users</h1>
        <button className="flex h-9 items-center gap-1.5 rounded-sm bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" />
          Add User
        </button>
      </div>

      {/* Role pills */}
      <div className="flex flex-wrap gap-2">
        {(["admin", "analyst", "responder", "viewer"] as Role[]).map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? "all" : role)}
            className={cn(
              "flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors",
              roleFilter === role
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-secondary"
            )}
          >
            <span
              className={cn(
                "rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                ROLE_COLORS[role]
              )}
            >
              {counts[role]}
            </span>
            <span className="text-foreground capitalize">{role}s</span>
          </button>
        ))}
      </div>

      {/* Search & filter */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-sm border border-border bg-input pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
          />
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-sm border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
          <Filter className="h-3.5 w-3.5" />
          Zone
        </button>
        <button className="flex h-9 items-center gap-1.5 rounded-sm border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
          <Filter className="h-3.5 w-3.5" />
          Status
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-sm border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-card-nested border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Zones
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Last Active
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-secondary/50"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-primary/15">
                        <span className="font-mono text-[10px] font-semibold text-primary">
                          {user.avatar}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase",
                        ROLE_COLORS[user.role]
                      )}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {user.zones.length} zone
                      {user.zones.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          STATUS_COLORS[user.status].dot
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs capitalize",
                          STATUS_COLORS[user.status].text
                        )}
                      >
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {formatLastActive(user.lastActive)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedUser(user)
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No users match your criteria
            </p>
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
      <div className="fixed inset-0 z-40 bg-background/60" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card">
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <h2 className="text-sm font-semibold text-foreground">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-primary/15">
              <span className="font-mono text-xl font-semibold text-primary">
                {user.avatar}
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">
                {user.name}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase",
                    ROLE_COLORS[user.role]
                  )}
                >
                  {user.role}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      STATUS_COLORS[user.status].dot
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs capitalize",
                      STATUS_COLORS[user.status].text
                    )}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground">{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Zones */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground">
              Assigned Zones
            </h3>
            <div className="space-y-2">
              {user.zones.map((z) => (
                <div key={z} className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="w-8 font-mono text-xs text-muted-foreground">
                    {z}
                  </span>
                  <span className="text-foreground">{ZONE_NAMES[z] || z}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground">
              Permissions
            </h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              {user.role === "admin" && (
                <>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Full system access
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> User management
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Settings configuration
                  </div>
                </>
              )}
              {user.role === "analyst" && (
                <>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> View all dashboards
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Create reports
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Export data
                  </div>
                </>
              )}
              {user.role === "responder" && (
                <>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> View assigned zones
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Update incident status
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Submit reports
                  </div>
                </>
              )}
              {user.role === "viewer" && (
                <>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> Read-only access
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" /> View public dashboards
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground">Activity</h3>
            <p className="text-xs text-muted-foreground">
              Last active: {formatLastActive(user.lastActive)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 border-t border-border px-4 py-3">
          <button className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-sm border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-sm border border-border bg-card text-xs font-medium text-foreground transition-colors hover:bg-secondary">
            <Key className="h-3.5 w-3.5" />
            Reset Password
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-sm bg-destructive px-3 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  )
}

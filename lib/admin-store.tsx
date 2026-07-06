"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

/* ------------------------------- Types ------------------------------- */

export type Plan = "free" | "pro" | "professional"
export type AccessLevel = "free" | "pro" | "professional"

export type AdminUser = {
  id: string
  name: string
  email: string
  plan: Plan
  status: "active" | "suspended"
  joinedAt: string
}

export type Payment = {
  id: string
  userId: string
  userName: string
  userEmail: string
  requestedPlan: Exclude<Plan, "free">
  amount: number
  method: string
  reference: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

export type CodeFile = {
  id: string
  name: string
  code: string
}

export type AssetSubButton = {
  id: string
  name: string
  icon: string
  previewLink: string
  zipLink: string
  codeFiles: CodeFile[]
  access: AccessLevel
}

export type AssetMainButton = {
  id: string
  name: string
  subButtons: AssetSubButton[]
}

/* ------------------------------ Seed data ---------------------------- */

const seedUsers: AdminUser[] = [
  { id: "u1", name: "Alex Chen", email: "alex@sys.int", plan: "pro", status: "active", joinedAt: "2025-11-02" },
  { id: "u2", name: "Maria Voss", email: "maria@sys.int", plan: "free", status: "active", joinedAt: "2026-01-14" },
  { id: "u3", name: "Kenji Ito", email: "kenji@sys.int", plan: "professional", status: "active", joinedAt: "2025-09-21" },
  { id: "u4", name: "Dana Brooks", email: "dana@sys.int", plan: "free", status: "suspended", joinedAt: "2026-02-08" },
  { id: "u5", name: "Omar Reyes", email: "omar@sys.int", plan: "free", status: "active", joinedAt: "2026-03-30" },
]

const seedPayments: Payment[] = [
  {
    id: "p1",
    userId: "u2",
    userName: "Maria Voss",
    userEmail: "maria@sys.int",
    requestedPlan: "pro",
    amount: 29,
    method: "Bank Transfer",
    reference: "TXN-88213",
    status: "pending",
    submittedAt: "2026-06-30",
  },
  {
    id: "p2",
    userId: "u5",
    userName: "Omar Reyes",
    userEmail: "omar@sys.int",
    requestedPlan: "professional",
    amount: 79,
    method: "Crypto (USDC)",
    reference: "0xA1F9...4C2",
    status: "pending",
    submittedAt: "2026-07-04",
  },
  {
    id: "p3",
    userId: "u1",
    userName: "Alex Chen",
    userEmail: "alex@sys.int",
    requestedPlan: "pro",
    amount: 29,
    method: "Card",
    reference: "ch_1P9x2",
    status: "approved",
    submittedAt: "2025-11-02",
  },
]

const seedAssets: AssetMainButton[] = [
  {
    id: "a1",
    name: "Components",
    subButtons: [
      {
        id: "s1",
        name: "Brutal Button",
        icon: "Square",
        previewLink: "https://hasandrone.vercel.app/",
        zipLink: "https://hasandrone.vercel.app/brutal-button.zip",
        codeFiles: [
          {
            id: "cf1",
            name: "brutal-button.tsx",
            code: `export function BrutalButton() {\n  return <button className="bg-foreground text-background px-4 py-2">Deploy</button>\n}`,
          },
        ],
        access: "free",
      },
    ],
  },
  {
    id: "a2",
    name: "Animated",
    subButtons: [
      {
        id: "s2",
        name: "Glitch Text",
        icon: "Sparkles",
        previewLink: "https://hasandrone.vercel.app/",
        zipLink: "",
        codeFiles: [
          {
            id: "cf2",
            name: "glitch-text.tsx",
            code: `export function GlitchText() {\n  return <span className="animate-glitch">SYS.INT</span>\n}`,
          },
        ],
        access: "pro",
      },
    ],
  },
]

/* ------------------------------ Context ------------------------------ */

type AdminContextValue = {
  users: AdminUser[]
  payments: Payment[]
  assets: AssetMainButton[]
  toggleUserStatus: (userId: string) => void
  setUserPlan: (userId: string, plan: Plan) => void
  approvePayment: (paymentId: string) => void
  rejectPayment: (paymentId: string) => void
  addMainButton: (name: string) => void
  removeMainButton: (mainId: string) => void
  addSubButton: (mainId: string, sub: Omit<AssetSubButton, "id">) => void
  removeSubButton: (mainId: string, subId: string) => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(seedUsers)
  const [payments, setPayments] = useState<Payment[]>(seedPayments)
  const [assets, setAssets] = useState<AssetMainButton[]>(seedAssets)

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u,
      ),
    )
  }, [])

  const setUserPlan = useCallback((userId: string, plan: Plan) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, plan } : u)))
  }, [])

  const approvePayment = useCallback((paymentId: string) => {
    setPayments((prev) => {
      const payment = prev.find((p) => p.id === paymentId)
      if (payment) {
        setUsers((users) =>
          users.map((u) => (u.id === payment.userId ? { ...u, plan: payment.requestedPlan } : u)),
        )
      }
      return prev.map((p) => (p.id === paymentId ? { ...p, status: "approved" } : p))
    })
  }, [])

  const rejectPayment = useCallback((paymentId: string) => {
    setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "rejected" } : p)))
  }, [])

  const addMainButton = useCallback((name: string) => {
    setAssets((prev) => [...prev, { id: `a${Date.now()}`, name, subButtons: [] }])
  }, [])

  const removeMainButton = useCallback((mainId: string) => {
    setAssets((prev) => prev.filter((m) => m.id !== mainId))
  }, [])

  const addSubButton = useCallback((mainId: string, sub: Omit<AssetSubButton, "id">) => {
    setAssets((prev) =>
      prev.map((m) =>
        m.id === mainId
          ? { ...m, subButtons: [...m.subButtons, { ...sub, id: `s${Date.now()}` }] }
          : m,
      ),
    )
  }, [])

  const removeSubButton = useCallback((mainId: string, subId: string) => {
    setAssets((prev) =>
      prev.map((m) =>
        m.id === mainId ? { ...m, subButtons: m.subButtons.filter((s) => s.id !== subId) } : m,
      ),
    )
  }, [])

  return (
    <AdminContext.Provider
      value={{
        users,
        payments,
        assets,
        toggleUserStatus,
        setUserPlan,
        approvePayment,
        rejectPayment,
        addMainButton,
        removeMainButton,
        addSubButton,
        removeSubButton,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider")
  return ctx
}

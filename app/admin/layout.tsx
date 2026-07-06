import type { ReactNode } from "react"
import { AdminProvider } from "@/lib/admin-store"
import { AdminShell } from "@/components/admin/admin-shell"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  )
}

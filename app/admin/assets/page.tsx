"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2, ChevronRight, ExternalLink, Boxes, Lock } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-shell"
import { useAdmin, type AccessLevel } from "@/lib/admin-store"

const ACCESS_OPTIONS: { id: AccessLevel; label: string }[] = [
  { id: "free", label: "Free" },
  { id: "pro", label: "Pro" },
  { id: "professional", label: "Professional" },
]

const accessBadge: Record<AccessLevel, string> = {
  free: "bg-secondary text-secondary-foreground",
  pro: "bg-[#ea580c] text-white",
  professional: "bg-foreground text-background",
}

export default function AssetsPage() {
  const { assets, addMainButton, removeMainButton, addSubButton, removeSubButton } = useAdmin()
  const [newMain, setNewMain] = useState("")
  const [openForm, setOpenForm] = useState<string | null>(null)

  function handleAddMain(e: React.FormEvent) {
    e.preventDefault()
    const name = newMain.trim()
    if (!name) return
    addMainButton(name)
    setNewMain("")
  }

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="ASSETS"
        description="Configure sidebar main buttons and their sub buttons"
      />

      <div className="p-4 lg:p-8 dot-grid-bg space-y-6">
        {/* Add main button */}
        <form
          onSubmit={handleAddMain}
          className="border-2 border-foreground bg-background p-4 flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
        >
          <div className="flex-1">
            <label className="block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
              {"// New Main Button (Category)"}
            </label>
            <input
              value={newMain}
              onChange={(e) => setNewMain(e.target.value)}
              placeholder="e.g. Components, Animated, Blocks"
              className="w-full border-2 border-foreground bg-background px-3 py-2 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-foreground text-background px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-[#ea580c] hover:text-white transition-colors"
          >
            <Plus size={14} strokeWidth={2} /> Add Main
          </button>
        </form>

        {/* Main buttons list */}
        {assets.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-foreground p-12 text-center">
            <Boxes size={28} strokeWidth={1.5} className="text-[#ea580c] mb-3" />
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              No main buttons yet. Add one above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((main) => (
              <div key={main.id} className="border-2 border-foreground bg-background">
                {/* Main header */}
                <div className="flex items-center justify-between border-b-2 border-foreground px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ChevronRight size={14} strokeWidth={2} className="text-[#ea580c]" />
                    <span className="text-xs font-mono uppercase tracking-widest font-bold">{main.name}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">
                      [{main.subButtons.length}]
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOpenForm(openForm === main.id ? null : main.id)}
                      className="flex items-center gap-1.5 border border-foreground/30 px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
                    >
                      <Plus size={12} strokeWidth={2} /> Sub
                    </button>
                    <button
                      onClick={() => removeMainButton(main.id)}
                      aria-label={`Delete ${main.name}`}
                      className="flex items-center justify-center border border-foreground/30 w-8 h-8 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Add sub-button form */}
                <AnimatePresence initial={false}>
                  {openForm === main.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-b-2 border-foreground"
                    >
                      <SubButtonForm
                        onSubmit={(sub) => {
                          addSubButton(main.id, sub)
                          setOpenForm(null)
                        }}
                        onCancel={() => setOpenForm(null)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sub buttons */}
                {main.subButtons.length === 0 ? (
                  <p className="px-4 py-4 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                    No sub buttons. Click &quot;Sub&quot; to add one.
                  </p>
                ) : (
                  <ul className="divide-y divide-foreground/15">
                    {main.subButtons.map((sub) => (
                      <li
                        key={sub.id}
                        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-mono">{sub.name}</span>
                            <span
                              className={`px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-widest ${accessBadge[sub.access]}`}
                            >
                              {sub.access}
                            </span>
                          </div>
                          {sub.previewLink && (
                            <a
                              href={sub.previewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-[9px] font-mono text-muted-foreground hover:text-[#ea580c] transition-colors"
                            >
                              <ExternalLink size={10} /> {sub.previewLink}
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => removeSubButton(main.id, sub.id)}
                          aria-label={`Delete ${sub.name}`}
                          className="flex items-center justify-center border border-foreground/30 w-8 h-8 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <Trash2 size={13} strokeWidth={1.5} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------- Sub button form ---------------------------- */

function SubButtonForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (sub: { name: string; previewLink: string; code: string; access: AccessLevel }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState("")
  const [previewLink, setPreviewLink] = useState("")
  const [code, setCode] = useState("")
  const [access, setAccess] = useState<AccessLevel>("free")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), previewLink: previewLink.trim(), code, access })
  }

  const field = "w-full border-2 border-foreground bg-background px-3 py-2 text-[12px] font-mono outline-none focus:border-[#ea580c] transition-colors"
  const labelCls = "block text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2"

  return (
    <form onSubmit={submit} className="p-4 space-y-4 bg-secondary/30">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>{"// 1. Sub Button Name"}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Brutal Button" className={field} />
        </div>
        <div>
          <label className={labelCls}>{"// 2. Preview Link"}</label>
          <input
            value={previewLink}
            onChange={(e) => setPreviewLink(e.target.value)}
            placeholder="https://..."
            className={field}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>{"// 3. Code"}</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste component code here..."
          rows={5}
          className={`${field} resize-y bg-[#0d0d0d] text-[#e6e6e6]`}
        />
      </div>

      <div>
        <label className={labelCls}>
          <Lock size={10} className="inline mr-1 -mt-0.5 text-[#ea580c]" /> {"4. Access Level"}
        </label>
        <div className="flex flex-wrap border-2 border-foreground w-fit">
          {ACCESS_OPTIONS.map((opt, i) => {
            const active = access === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAccess(opt.id)}
                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors ${
                  i > 0 ? "border-l-2 border-foreground" : ""
                } ${active ? "bg-foreground text-background" : "hover:bg-foreground/5"}`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="bg-foreground text-background px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-[#ea580c] hover:text-white transition-colors"
        >
          Save Sub Button
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border-2 border-foreground px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

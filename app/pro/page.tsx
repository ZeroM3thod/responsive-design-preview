import type { Metadata } from "next"
import { Workspace } from "@/components/workspace/workspace"

export const metadata: Metadata = {
  title: "Pro Workspace | SYS.INT UI Library",
  description:
    "Browse the full SYS.INT component library with live previews and downloadable source code. Components, animated effects, blocks, and landing page templates.",
}

export default function ProPage() {
  return <Workspace />
}

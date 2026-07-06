import type { Metadata } from "next"
import { Workspace } from "@/components/workspace/workspace"

export const metadata: Metadata = {
  title: "Template Preview | SYS.INT UI Library",
  description:
    "Preview the SYS.INT component library. Live previews for components, animated effects, blocks, and landing page templates. Source code unlocks with Pro.",
}

export default function TemplatePage() {
  return <Workspace locked />
}

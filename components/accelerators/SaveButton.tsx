"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAccelStore } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import type { Region } from "@/lib/types";

export function SaveButton({
  id,
  name,
  slug,
  region,
}: {
  id: string;
  name: string;
  slug: string;
  region: Region | null;
}) {
  const { saveAccelerator, unsaveAccelerator, isSaved } = useAccelStore();
  const { success, info } = useToast();
  const saved = isSaved(id);

  function toggle() {
    if (saved) {
      unsaveAccelerator(id);
      info("Removed", `${name} removed from your list.`);
    } else {
      saveAccelerator({
        acceleratorId: id,
        acceleratorName: name,
        acceleratorSlug: slug,
        region: region ?? "",
      });
      success("Saved", `${name} added to your list.`);
    }
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all"
      style={{
        borderColor: saved ? "rgba(99,102,241,0.4)" : "var(--border)",
        backgroundColor: saved ? "rgba(99,102,241,0.08)" : "transparent",
        color: saved ? "var(--accent-2)" : "var(--muted)",
      }}
    >
      {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      {saved ? "Saved" : "Save to List"}
    </button>
  );
}

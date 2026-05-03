"use client";

import { Customer } from "@/lib/types";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_COLORS: Record<string, {bg: string; text: string}> = {
  "New Lead":   { bg: "rgba(59,130,246,0.12)",  text: "#60a5fa" },
  "Interested": { bg: "rgba(234,179,8,0.12)",   text: "#fbbf24" },
  "Ordered":    { bg: "rgba(168,85,247,0.12)",  text: "#c084fc" },
  "Completed":  { bg: "rgba(16,185,129,0.12)",  text: "#34d399" },
  "Lost":       { bg: "rgba(239,68,68,0.12)",   text: "#f87171" },
};

const SOURCE_ICON: Record<string, string> = { WhatsApp: "💬", Instagram: "📸", Other: "🔗" };

export default function CustomerCard({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const sc = STATUS_COLORS[customer.status] ?? { bg: "rgba(99,179,237,0.1)", text: "var(--text-muted)" };

  async function handleDelete() {
    if (!confirm(`"${customer.name}" ko delete karna chahte hain?`)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("customers").delete().eq("id", customer.id);
    router.refresh();
  }

  return (
    <div className="card rounded-2xl p-5" style={{background:'var(--surface)'}}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm font-display flex-shrink-0"
            style={{background:'rgba(59,130,246,0.1)', color:'var(--accent)'}}>
            {customer.name[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold truncate" style={{color:'var(--text)'}}>{customer.name}</p>
            <p className="text-xs" style={{color:'var(--text-muted)'}}>
              {SOURCE_ICON[customer.source]} {customer.source}
              {customer.phone && <span style={{color:'var(--text-dim)'}}> · {customer.phone}</span>}
            </p>
          </div>
        </div>
        <span className="status-badge flex-shrink-0" style={{background: sc.bg, color: sc.text}}>
          {customer.status}
        </span>
      </div>

      {customer.notes && (
        <p className="text-xs mb-3 px-3 py-2 rounded-lg line-clamp-2" style={{background:'var(--surface2)', color:'var(--text-muted)', border:'1px solid var(--border)'}}>
          {customer.notes}
        </p>
      )}

      {customer.follow_up_date && (
        <p className="text-xs mb-3" style={{color:'#f59e0b'}}>
          ◷ Follow-up: {new Date(customer.follow_up_date + "T00:00:00").toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" })}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Link href={`/dashboard/customers/${customer.id}/edit`}
          className="flex-1 text-center text-xs py-2 rounded-lg font-semibold font-display transition-all"
          style={{background:'rgba(99,179,237,0.06)', border:'1px solid var(--border)', color:'var(--text-muted)'}}>
          Edit
        </Link>
        {customer.phone && (
          <a href={`https://wa.me/92${customer.phone.replace(/^0/, "").replace(/\D/g, "")}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-xs py-2 rounded-lg font-semibold font-display transition-all"
            style={{background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#34d399'}}>
            💬 WhatsApp
          </a>
        )}
        <button onClick={handleDelete} disabled={deleting}
          className="px-3 py-2 rounded-lg text-xs transition-all"
          style={{background:'transparent', border:'1px solid transparent', color:'rgba(239,68,68,0.5)'}}>
          {deleting ? "..." : "✕"}
        </button>
      </div>
    </div>
  );
}

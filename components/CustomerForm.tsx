"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Customer, CustomerSource, CustomerStatus } from "@/lib/types";

const SOURCES: CustomerSource[] = ["WhatsApp", "Instagram", "Other"];
const STATUSES: CustomerStatus[] = ["New Lead", "Interested", "Ordered", "Completed", "Lost"];
const STATUS_LABELS: Record<CustomerStatus, string> = {
  "New Lead": "🌟 Naya Lead", Interested: "🤔 Interested",
  Ordered: "📦 Order Diya", Completed: "✅ Complete", Lost: "❌ Lost",
};
const SOURCE_ICONS: Record<string, string> = { WhatsApp: "💬", Instagram: "📸", Other: "🔗" };

export default function CustomerForm({ customer, userId }: { customer?: Customer; userId: string }) {
  const router = useRouter();
  const isEdit = !!customer;

  const [form, setForm] = useState({
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
    source: customer?.source ?? ("WhatsApp" as CustomerSource),
    status: customer?.status ?? ("New Lead" as CustomerStatus),
    notes: customer?.notes ?? "",
    follow_up_date: customer?.follow_up_date ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name.trim()) {
      setError("Customer ka naam zaroori hai.");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Get current session to verify auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Session expire ho gaya. Dobara login karein.");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      source: form.source,
      status: form.status,
      notes: form.notes.trim() || null,
      follow_up_date: form.follow_up_date || null,
      user_id: session.user.id,
    };

    let err;
    if (isEdit) {
      const res = await supabase.from("customers").update(payload).eq("id", customer.id);
      err = res.error;
    } else {
      const res = await supabase.from("customers").insert([payload]);
      err = res.error;
    }

    if (err) {
      console.error("Supabase error:", err);
      setError(`Error: ${err.message}`);
      setLoading(false);
    } else {
      router.push("/dashboard/customers");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>
          Customer ka Naam <span style={{color:'#f87171'}}>*</span>
        </label>
        <input type="text" value={form.name} onChange={e => update("name", e.target.value)}
          className="input-field px-4 py-3 rounded-xl text-sm"
          placeholder="Jaise: Ahmed Khan" required />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>
          Phone Number <span style={{color:'var(--text-dim)'}}>— optional</span>
        </label>
        <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)}
          className="input-field px-4 py-3 rounded-xl text-sm"
          placeholder="03XX-XXXXXXX" />
      </div>

      {/* Source */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>Kahan se Aaya?</label>
        <div className="flex gap-2">
          {SOURCES.map(s => (
            <button key={s} type="button" onClick={() => update("source", s)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-display transition-all"
              style={{
                background: form.source === s ? 'rgba(59,130,246,0.15)' : 'rgba(15,21,32,0.8)',
                border: form.source === s ? '1px solid rgba(59,130,246,0.4)' : '1px solid var(--border)',
                color: form.source === s ? 'var(--accent)' : 'var(--text-muted)',
              }}>
              {SOURCE_ICONS[s]} {s}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>Customer Status</label>
        <select value={form.status} onChange={e => update("status", e.target.value)}
          className="input-field px-4 py-3 rounded-xl text-sm"
          style={{background:'rgba(8,12,18,0.8)'}}>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      {/* Follow-up Date */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>
          Follow-up ki Tarikh <span style={{color:'var(--text-dim)'}}>— optional</span>
        </label>
        <input type="date" value={form.follow_up_date} onChange={e => update("follow_up_date", e.target.value)}
          className="input-field px-4 py-3 rounded-xl text-sm" />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>
          Notes <span style={{color:'var(--text-dim)'}}>— optional</span>
        </label>
        <textarea value={form.notes} onChange={e => update("notes", e.target.value)}
          rows={3} className="input-field px-4 py-3 rounded-xl text-sm resize-none"
          placeholder="Koi baat yaad rakhni ho..." />
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm" style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171'}}>
          ⚠️ {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()}
          className="btn-ghost flex-1 py-3 rounded-xl text-sm font-semibold font-display">
          ← Wapas
        </button>
        <button type="submit" disabled={loading}
          className="btn-primary flex-1 py-3 rounded-xl text-sm">
          {loading ? "Save ho raha hai..." : isEdit ? "✓ Update Karein" : "⊕ Add Karein"}
        </button>
      </div>
    </form>
  );
}

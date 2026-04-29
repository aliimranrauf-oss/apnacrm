"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Customer, CustomerSource, CustomerStatus } from "@/lib/types";

const SOURCES: CustomerSource[] = ["WhatsApp", "Instagram", "Other"];
const STATUSES: CustomerStatus[] = ["New Lead", "Interested", "Ordered", "Completed", "Lost"];

const STATUS_LABELS: Record<CustomerStatus, string> = {
  "New Lead": "🌟 Naya Lead",
  Interested: "🤔 Interested",
  Ordered: "📦 Order Diya",
  Completed: "✅ Complete",
  Lost: "❌ Lost",
};

interface Props {
  customer?: Customer;
  userId: string;
}

export default function CustomerForm({ customer, userId }: Props) {
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
    setForm((prev) => ({ ...prev, [field]: value }));
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
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      source: form.source,
      status: form.status,
      notes: form.notes.trim() || null,
      follow_up_date: form.follow_up_date || null,
      user_id: userId,
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
      setError("Kuch masla aa gaya. Dobara try karein.");
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
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Customer ka Naam <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          placeholder="Jaise: Ahmed Khan"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone Number (optional)
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          placeholder="03XX-XXXXXXX"
        />
      </div>

      {/* Source */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Kahan se Aaya?
        </label>
        <div className="flex gap-2">
          {SOURCES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update("source", s)}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${
                form.source === s
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s === "WhatsApp" ? "💬 WhatsApp" : s === "Instagram" ? "📸 Instagram" : "🔗 Other"}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Customer Status
        </label>
        <select
          value={form.status}
          onChange={(e) => update("status", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Follow-up Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Follow-up ki Tarikh (optional)
        </label>
        <input
          type="date"
          value={form.follow_up_date}
          onChange={(e) => update("follow_up_date", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Notes (optional)
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition resize-none"
          placeholder="Koi baat yaad rakhni ho toh yahan likho..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition"
        >
          Wapas Jao
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-60"
        >
          {loading ? "Save ho raha hai..." : isEdit ? "✅ Update Karein" : "➕ Add Karein"}
        </button>
      </div>
    </form>
  );
}

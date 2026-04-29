"use client";

import { Customer } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CustomerCard({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${customer.name}" ko delete karna chahte hain?`)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("customers").delete().eq("id", customer.id);
    router.refresh();
  }

  const sourceEmoji =
    customer.source === "WhatsApp"
      ? "💬"
      : customer.source === "Instagram"
      ? "📸"
      : "🔗";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
            {customer.name[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{customer.name}</p>
            <p className="text-sm text-gray-500">
              {sourceEmoji} {customer.source}
              {customer.phone && (
                <span className="ml-2 text-gray-400">• {customer.phone}</span>
              )}
            </p>
          </div>
        </div>
        <StatusBadge status={customer.status as any} />
      </div>

      {customer.notes && (
        <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 line-clamp-2">
          📝 {customer.notes}
        </p>
      )}

      {customer.follow_up_date && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-orange-600">
          <span>📅</span>
          <span>Follow-up: {new Date(customer.follow_up_date + "T00:00:00").toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <Link
          href={`/dashboard/customers/${customer.id}/edit`}
          className="flex-1 text-center text-sm py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-medium"
        >
          ✏️ Edit
        </Link>
        {customer.phone && (
          <a
            href={`https://wa.me/92${customer.phone.replace(/^0/, "").replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition font-medium border border-green-200"
          >
            💬 WhatsApp
          </a>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition border border-transparent hover:border-red-200"
        >
          {deleting ? "..." : "🗑️"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function MarkDoneButton({ customerId }: { customerId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleMarkDone() {
    setLoading(true);
    const supabase = createClient();
    await supabase
      .from("customers")
      .update({ follow_up_date: null, status: "Completed" })
      .eq("id", customerId);
    router.refresh();
  }

  return (
    <button
      onClick={handleMarkDone}
      disabled={loading}
      className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-60 font-medium"
    >
      {loading ? "..." : "✅ Done"}
    </button>
  );
}

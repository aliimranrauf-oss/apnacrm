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
    await supabase.from("customers").update({ follow_up_date: null, status: "Completed" }).eq("id", customerId);
    router.refresh();
  }

  return (
    <button onClick={handleMarkDone} disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg font-semibold font-display transition-all"
      style={{background:'rgba(16,185,129,0.15)', color:'#34d399', border:'1px solid rgba(16,185,129,0.25)'}}>
      {loading ? "..." : "✓ Done"}
    </button>
  );
}

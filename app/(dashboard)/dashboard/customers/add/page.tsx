import { createServerSupabaseClient } from "@/lib/supabase-server";
import CustomerForm from "@/components/CustomerForm";
import Link from "next/link";

export default async function AddCustomerPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-lg mx-auto animate-fadeUp">
      <Link href="/dashboard/customers"
        className="inline-flex items-center gap-2 text-sm mb-6 transition-all"
        style={{color:'var(--text-muted)'}}>
        ← Wapas Customers
      </Link>
      <div className="rounded-2xl p-6" style={{background:'var(--surface)', border:'1px solid var(--border)'}}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'var(--accent)'}}>New Entry</p>
        <h1 className="text-xl font-display font-bold mb-1" style={{color:'var(--text)'}}>Naya Customer Add Karein</h1>
        <p className="text-sm mb-6" style={{color:'var(--text-muted)'}}>Apna naya lead ya customer add karein</p>
        <CustomerForm userId={user!.id} />
      </div>
    </div>
  );
}

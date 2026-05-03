import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Customer } from "@/lib/types";
import Link from "next/link";
import CustomerCard from "@/components/CustomerCard";
import CustomerSearch from "@/components/CustomerSearch";

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const { q, status } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase.from("customers").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data } = await query;
  let customers = (data as Customer[]) ?? [];
  if (q) {
    const lower = q.toLowerCase();
    customers = customers.filter(c => c.name.toLowerCase().includes(lower) || (c.phone ?? "").includes(lower));
  }

  const FILTERS = [
    { label: "Sab", value: "" },
    { label: "Naye Leads", value: "New Lead" },
    { label: "Interested", value: "Interested" },
    { label: "Ordered", value: "Ordered" },
    { label: "Complete", value: "Completed" },
    { label: "Lost", value: "Lost" },
  ];

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'var(--accent)'}}>Database</p>
          <h1 className="text-2xl font-display font-bold" style={{color:'var(--text)'}}>Sab Customers</h1>
          <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>{customers.length} records</p>
        </div>
        <Link href="/dashboard/customers/add"
          className="btn-primary text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2">
          <span>⊕</span>
          <span className="hidden sm:inline">Naya Customer</span>
        </Link>
      </div>

      <CustomerSearch initialQuery={q ?? ""} />

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{scrollbarWidth:'none'}}>
        {FILTERS.map(f => {
          const isActive = (status ?? "") === f.value;
          const href = f.value
            ? `/dashboard/customers?status=${encodeURIComponent(f.value)}${q ? `&q=${q}` : ""}`
            : `/dashboard/customers${q ? `?q=${q}` : ""}`;
          return (
            <Link key={f.value} href={href}
              className="whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold font-display uppercase tracking-wider transition-all"
              style={{
                background: isActive ? 'rgba(59,130,246,0.15)' : 'var(--surface)',
                border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border)',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              }}>
              {f.label}
            </Link>
          );
        })}
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{border:'1px dashed var(--border)'}}>
          <p className="text-3xl mb-3" style={{color:'var(--text-dim)'}}>◈</p>
          <p className="font-display font-semibold" style={{color:'var(--text-muted)'}}>Koi customer nahi mila</p>
          {!q && (
            <Link href="/dashboard/customers/add"
              className="btn-primary inline-block mt-5 px-5 py-2.5 rounded-xl text-sm">
              Pehla Customer Add Karein
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map(c => <CustomerCard key={c.id} customer={c} />)}
        </div>
      )}
    </div>
  );
}

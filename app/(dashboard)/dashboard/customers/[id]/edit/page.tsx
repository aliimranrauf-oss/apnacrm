import { createServerSupabaseClient } from "@/lib/supabase-server";
import CustomerForm from "@/components/CustomerForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Customer } from "@/lib/types";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase.from("customers").select("*").eq("id", id).eq("user_id", user!.id).single();
  if (!data) notFound();

  const customer = data as Customer;

  return (
    <div className="max-w-lg mx-auto animate-fadeUp">
      <Link href="/dashboard/customers"
        className="inline-flex items-center gap-2 text-sm mb-6"
        style={{color:'var(--text-muted)'}}>
        ← Wapas Customers
      </Link>
      <div className="rounded-2xl p-6" style={{background:'var(--surface)', border:'1px solid var(--border)'}}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'var(--accent)'}}>Edit Record</p>
        <h1 className="text-xl font-display font-bold mb-1" style={{color:'var(--text)'}}>Customer Update Karein</h1>
        <p className="text-sm mb-6" style={{color:'var(--text-muted)'}}>{customer.name} ki details</p>
        <CustomerForm customer={customer} userId={user!.id} />
      </div>
    </div>
  );
}

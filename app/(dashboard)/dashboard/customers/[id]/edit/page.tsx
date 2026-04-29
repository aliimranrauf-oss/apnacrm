import { createServerSupabaseClient } from "@/lib/supabase-server";
import CustomerForm from "@/components/CustomerForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Customer } from "@/lib/types";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!data) notFound();

  const customer = data as Customer;

  return (
    <div className="max-w-lg mx-auto">
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        ← Wapas Customers
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Customer Update Karein</h1>
        <p className="text-gray-500 text-sm mb-6">{customer.name} ki details update karein</p>
        <CustomerForm customer={customer} userId={user!.id} />
      </div>
    </div>
  );
}

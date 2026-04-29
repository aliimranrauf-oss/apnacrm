import { createServerSupabaseClient } from "@/lib/supabase-server";
import CustomerForm from "@/components/CustomerForm";
import Link from "next/link";

export default async function AddCustomerPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="max-w-lg mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard/customers"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        ← Wapas Customers
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Naya Customer Add Karein</h1>
        <p className="text-gray-500 text-sm mb-6">Apna naya lead ya customer add karein</p>
        <CustomerForm userId={user!.id} />
      </div>
    </div>
  );
}

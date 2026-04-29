import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Customer } from "@/lib/types";
import Link from "next/link";
import CustomerCard from "@/components/CustomerCard";
import CustomerSearch from "@/components/CustomerSearch";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("customers")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const { data } = await query;
  let customers = (data as Customer[]) ?? [];

  // Client-side search filter
  if (q) {
    const lower = q.toLowerCase();
    customers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        (c.phone ?? "").includes(lower)
    );
  }

  const STATUS_FILTERS = [
    { label: "Sab", value: "" },
    { label: "🌟 Naye Leads", value: "New Lead" },
    { label: "🤔 Interested", value: "Interested" },
    { label: "📦 Ordered", value: "Ordered" },
    { label: "✅ Complete", value: "Completed" },
    { label: "❌ Lost", value: "Lost" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sab Customers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{customers.length} customers mile</p>
        </div>
        <Link
          href="/dashboard/customers/add"
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          <span>➕</span>
          <span className="hidden sm:inline">Naya Customer</span>
        </Link>
      </div>

      {/* Search */}
      <CustomerSearch initialQuery={q ?? ""} />

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {STATUS_FILTERS.map((f) => {
          const isActive = (status ?? "") === f.value;
          const href = f.value
            ? `/dashboard/customers?status=${encodeURIComponent(f.value)}${q ? `&q=${q}` : ""}`
            : `/dashboard/customers${q ? `?q=${q}` : ""}`;
          return (
            <Link
              key={f.value}
              href={href}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition border ${
                isActive
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Customer Cards */}
      {customers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-gray-500 text-lg font-medium">Koi customer nahi mila</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            {q ? `"${q}" se koi match nahi` : "Abhi tak koi customer nahi"}
          </p>
          {!q && (
            <Link
              href="/dashboard/customers/add"
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Pehla Customer Add Karein
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
}

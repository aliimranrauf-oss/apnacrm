import { createServerSupabaseClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Customer } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user!.id);

  const all = (customers as Customer[]) ?? [];
  const today = new Date().toISOString().split("T")[0];

  const stats = {
    total: all.length,
    newLeads: all.filter((c) => c.status === "New Lead").length,
    followUpsToday: all.filter((c) => c.follow_up_date === today).length,
    completed: all.filter((c) => c.status === "Completed").length,
    interested: all.filter((c) => c.status === "Interested").length,
    ordered: all.filter((c) => c.status === "Ordered").length,
  };

  const recentCustomers = all
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const todayFollowUps = all.filter((c) => c.follow_up_date === today).slice(0, 3);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Aapka Dashboard</h1>
        <p className="text-gray-500 mt-1">Sab kuch ek nazar mein dekho</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon="👥"
          label="Sab Customers"
          value={stats.total}
          color="blue"
          href="/dashboard/customers"
        />
        <StatCard
          icon="🌟"
          label="Naye Leads"
          value={stats.newLeads}
          color="purple"
          href="/dashboard/customers?status=New Lead"
        />
        <StatCard
          icon="📅"
          label="Aaj Follow-up"
          value={stats.followUpsToday}
          color="orange"
          href="/dashboard/followups"
        />
        <StatCard
          icon="✅"
          label="Complete Orders"
          value={stats.completed}
          color="green"
          href="/dashboard/customers?status=Completed"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Today's Follow-ups */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">📅 Aaj ke Follow-ups</h2>
            <Link href="/dashboard/followups" className="text-sm text-green-600 hover:underline">
              Sab dekho
            </Link>
          </div>
          {todayFollowUps.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              Aaj koi follow-up nahi 🎉
            </p>
          ) : (
            <div className="space-y-3">
              {todayFollowUps.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.phone ?? "No phone"}</p>
                  </div>
                  <Link
                    href={`/dashboard/customers/${c.id}/edit`}
                    className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                  >
                    Update
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Customers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">🆕 Naaye Customers</h2>
            <Link href="/dashboard/customers" className="text-sm text-green-600 hover:underline">
              Sab dekho
            </Link>
          </div>
          {recentCustomers.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm mb-3">Abhi tak koi customer nahi</p>
              <Link
                href="/dashboard/customers/add"
                className="inline-block bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Pehla Customer Add Karein
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCustomers.map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
                      {c.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.source}</p>
                    </div>
                  </div>
                  <StatusPill status={c.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-semibold text-lg">Naya Customer Add Karein</h3>
          <p className="text-green-100 text-sm mt-0.5">Koi lead miss na ho</p>
        </div>
        <Link
          href="/dashboard/customers/add"
          className="bg-white text-green-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition text-sm whitespace-nowrap"
        >
          ➕ Add Customer
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  href,
}: {
  icon: string;
  label: string;
  value: number;
  color: "blue" | "purple" | "orange" | "green";
  href: string;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <Link href={href}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition cursor-pointer">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${colors[color]}`}>
          {icon}
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "New Lead": "bg-blue-100 text-blue-700",
    Interested: "bg-yellow-100 text-yellow-700",
    Ordered: "bg-purple-100 text-purple-700",
    Completed: "bg-green-100 text-green-700",
    Lost: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${map[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

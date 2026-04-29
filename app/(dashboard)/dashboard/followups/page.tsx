import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Customer } from "@/lib/types";
import Link from "next/link";
import MarkDoneButton from "@/components/MarkDoneButton";

export default async function FollowUpsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date().toISOString().split("T")[0];

  const { data: todayData } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user!.id)
    .eq("follow_up_date", today)
    .order("created_at", { ascending: false });

  const { data: upcomingData } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user!.id)
    .gt("follow_up_date", today)
    .order("follow_up_date", { ascending: true })
    .limit(10);

  const { data: overdueData } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user!.id)
    .lt("follow_up_date", today)
    .not("follow_up_date", "is", null)
    .order("follow_up_date", { ascending: false })
    .limit(10);

  const todayFollowUps = (todayData as Customer[]) ?? [];
  const upcoming = (upcomingData as Customer[]) ?? [];
  const overdue = (overdueData as Customer[]) ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Follow-ups</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString("en-PK", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Today */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📅</span>
          <h2 className="font-semibold text-gray-800">
            Aaj ke Follow-ups
          </h2>
          {todayFollowUps.length > 0 && (
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {todayFollowUps.length}
            </span>
          )}
        </div>

        {todayFollowUps.length === 0 ? (
          <div className="bg-green-50 rounded-2xl p-6 text-center">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-green-700 font-medium">Aaj sab clear! Koi follow-up nahi.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayFollowUps.map((c) => (
              <FollowUpCard key={c.id} customer={c} showMarkDone />
            ))}
          </div>
        )}
      </section>

      {/* Overdue */}
      {overdue.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⚠️</span>
            <h2 className="font-semibold text-gray-800">Purane Follow-ups (Miss Ho Gaye)</h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {overdue.length}
            </span>
          </div>
          <div className="space-y-3">
            {overdue.map((c) => (
              <FollowUpCard key={c.id} customer={c} overdue />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔮</span>
            <h2 className="font-semibold text-gray-800">Aane Wale Follow-ups</h2>
          </div>
          <div className="space-y-3">
            {upcoming.map((c) => (
              <FollowUpCard key={c.id} customer={c} />
            ))}
          </div>
        </section>
      )}

      {todayFollowUps.length === 0 && overdue.length === 0 && upcoming.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📅</div>
          <p className="text-gray-500 text-lg font-medium">Koi follow-up set nahi</p>
          <p className="text-gray-400 text-sm mt-1 mb-6">
            Customer add karte waqt follow-up date set karein
          </p>
          <Link
            href="/dashboard/customers"
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Customers Dekho
          </Link>
        </div>
      )}
    </div>
  );
}

function FollowUpCard({
  customer,
  showMarkDone,
  overdue,
}: {
  customer: Customer;
  showMarkDone?: boolean;
  overdue?: boolean;
}) {
  const sourceEmoji =
    customer.source === "WhatsApp" ? "💬" : customer.source === "Instagram" ? "📸" : "🔗";

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4 ${
        overdue ? "border-red-200" : showMarkDone ? "border-orange-200" : "border-gray-100"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
          overdue ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
        }`}
      >
        {customer.name[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{customer.name}</p>
        <p className="text-sm text-gray-500">
          {sourceEmoji} {customer.source}
          {customer.phone && <span className="ml-2">• {customer.phone}</span>}
        </p>
        {customer.notes && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">📝 {customer.notes}</p>
        )}
        {overdue && customer.follow_up_date && (
          <p className="text-xs text-red-500 mt-0.5">
            Miss: {new Date(customer.follow_up_date + "T00:00:00").toLocaleDateString("en-PK")}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        {showMarkDone && <MarkDoneButton customerId={customer.id} />}
        <Link
          href={`/dashboard/customers/${customer.id}/edit`}
          className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-600 transition text-center"
        >
          ✏️ Edit
        </Link>
        {customer.phone && (
          <a
            href={`https://wa.me/92${customer.phone.replace(/^0/, "").replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg text-green-700 transition text-center border border-green-200"
          >
            💬 WA
          </a>
        )}
      </div>
    </div>
  );
}

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Customer } from "@/lib/types";
import Link from "next/link";
import MarkDoneButton from "@/components/MarkDoneButton";

export default async function FollowUpsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const today = new Date().toISOString().split("T")[0];

  const { data: todayData } = await supabase.from("customers").select("*").eq("user_id", user!.id).eq("follow_up_date", today);
  const { data: upcomingData } = await supabase.from("customers").select("*").eq("user_id", user!.id).gt("follow_up_date", today).order("follow_up_date", { ascending: true }).limit(10);
  const { data: overdueData } = await supabase.from("customers").select("*").eq("user_id", user!.id).lt("follow_up_date", today).not("follow_up_date", "is", null).order("follow_up_date", { ascending: false }).limit(10);

  const todayList = (todayData as Customer[]) ?? [];
  const upcoming = (upcomingData as Customer[]) ?? [];
  const overdue = (overdueData as Customer[]) ?? [];

  return (
    <div className="animate-fadeUp">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'var(--accent)'}}>Schedule</p>
        <h1 className="text-2xl font-display font-bold" style={{color:'var(--text)'}}>Follow-ups</h1>
        <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>
          {new Date().toLocaleDateString("en-PK", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
        </p>
      </div>

      {/* Today */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display font-semibold" style={{color:'var(--text)'}}>Aaj ke Follow-ups</h2>
          {todayList.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-bold font-display"
              style={{background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.2)'}}>
              {todayList.length}
            </span>
          )}
        </div>

        {todayList.length === 0 ? (
          <div className="text-center py-10 rounded-2xl" style={{background:'rgba(16,185,129,0.05)', border:'1px solid rgba(16,185,129,0.15)'}}>
            <p className="text-2xl mb-2" style={{color:'#34d399'}}>✦</p>
            <p className="font-display font-semibold" style={{color:'#34d399'}}>Aaj sab clear!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayList.map(c => <FollowUpCard key={c.id} customer={c} showMarkDone />)}
          </div>
        )}
      </section>

      {overdue.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display font-semibold" style={{color:'var(--text)'}}>Miss Ho Gaye</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold font-display"
              style={{background:'rgba(239,68,68,0.1)', color:'#f87171', border:'1px solid rgba(239,68,68,0.2)'}}>
              {overdue.length}
            </span>
          </div>
          <div className="space-y-3">
            {overdue.map(c => <FollowUpCard key={c.id} customer={c} overdue />)}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="font-display font-semibold mb-4" style={{color:'var(--text)'}}>Aane Wale Follow-ups</h2>
          <div className="space-y-3">
            {upcoming.map(c => <FollowUpCard key={c.id} customer={c} />)}
          </div>
        </section>
      )}

      {todayList.length === 0 && overdue.length === 0 && upcoming.length === 0 && (
        <div className="text-center py-20 rounded-2xl" style={{border:'1px dashed var(--border)'}}>
          <p className="text-3xl mb-3" style={{color:'var(--text-dim)'}}>◷</p>
          <p className="font-display font-semibold mb-1" style={{color:'var(--text-muted)'}}>Koi follow-up set nahi</p>
          <p className="text-sm mb-5" style={{color:'var(--text-dim)'}}>Customer add karte waqt date set karein</p>
          <Link href="/dashboard/customers" className="btn-primary inline-block px-5 py-2.5 rounded-xl text-sm">
            Customers Dekho
          </Link>
        </div>
      )}
    </div>
  );
}

function FollowUpCard({ customer, showMarkDone, overdue }: { customer: Customer; showMarkDone?: boolean; overdue?: boolean }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl"
      style={{
        background:'var(--surface)',
        border: overdue ? '1px solid rgba(239,68,68,0.2)' : showMarkDone ? '1px solid rgba(245,158,11,0.2)' : '1px solid var(--border)',
      }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm font-display flex-shrink-0"
        style={{background: overdue ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', color: overdue ? '#f87171' : 'var(--accent)'}}>
        {customer.name[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm truncate" style={{color:'var(--text)'}}>{customer.name}</p>
        <p className="text-xs" style={{color:'var(--text-muted)'}}>
          {customer.source}{customer.phone && ` · ${customer.phone}`}
        </p>
        {overdue && customer.follow_up_date && (
          <p className="text-xs mt-0.5" style={{color:'#f87171'}}>
            Miss: {new Date(customer.follow_up_date + "T00:00:00").toLocaleDateString("en-PK")}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        {showMarkDone && <MarkDoneButton customerId={customer.id} />}
        <Link href={`/dashboard/customers/${customer.id}/edit`}
          className="text-xs px-3 py-1.5 rounded-lg text-center font-semibold"
          style={{background:'rgba(99,179,237,0.06)', border:'1px solid var(--border)', color:'var(--text-muted)'}}>
          Edit
        </Link>
        {customer.phone && (
          <a href={`https://wa.me/92${customer.phone.replace(/^0/, "").replace(/\D/g, "")}`}
            target="_blank" rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg text-center font-semibold"
            style={{background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'#34d399'}}>
            WA
          </a>
        )}
      </div>
    </div>
  );
}

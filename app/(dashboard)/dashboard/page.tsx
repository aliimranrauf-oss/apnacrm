import { createServerSupabaseClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Customer } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: customers } = await supabase.from("customers").select("*").eq("user_id", user!.id);

  const all = (customers as Customer[]) ?? [];
  const today = new Date().toISOString().split("T")[0];

  const stats = {
    total: all.length,
    newLeads: all.filter(c => c.status === "New Lead").length,
    followUpsToday: all.filter(c => c.follow_up_date === today).length,
    completed: all.filter(c => c.status === "Completed").length,
  };

  const recent = all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);
  const todayFollowUps = all.filter(c => c.follow_up_date === today).slice(0, 4);

  const STATUS_COLORS: Record<string, string> = {
    "New Lead": "rgba(59,130,246,0.15)",
    "Interested": "rgba(234,179,8,0.15)",
    "Ordered": "rgba(168,85,247,0.15)",
    "Completed": "rgba(16,185,129,0.15)",
    "Lost": "rgba(239,68,68,0.15)",
  };
  const STATUS_TEXT: Record<string, string> = {
    "New Lead": "#60a5fa",
    "Interested": "#fbbf24",
    "Ordered": "#c084fc",
    "Completed": "#34d399",
    "Lost": "#f87171",
  };

  return (
    <div className="animate-fadeUp">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{color:'var(--accent)'}}>Overview</p>
        <h1 className="text-2xl font-display font-bold" style={{color:'var(--text)'}}>Aapka Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Sab Customers", value: stats.total, icon: "◈", color: "#3b82f6", href: "/dashboard/customers" },
          { label: "Naye Leads", value: stats.newLeads, icon: "⬡", color: "#06b6d4", href: "/dashboard/customers?status=New Lead" },
          { label: "Aaj Follow-up", value: stats.followUpsToday, icon: "◷", color: "#f59e0b", href: "/dashboard/followups" },
          { label: "Complete", value: stats.completed, icon: "✦", color: "#10b981", href: "/dashboard/customers?status=Completed" },
        ].map((s, i) => (
          <Link href={s.href} key={i}>
            <div className="stat-card rounded-2xl p-5 cursor-pointer" style={{animationDelay:`${i*0.05}s`}}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl" style={{color: s.color}}>{s.icon}</span>
                <div className="w-1.5 h-1.5 rounded-full" style={{background: s.color, boxShadow:`0 0 6px ${s.color}`}} />
              </div>
              <p className="text-3xl font-display font-bold" style={{color: s.color}}>{s.value}</p>
              <p className="text-xs mt-1 font-medium" style={{color:'var(--text-muted)'}}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Today's Follow-ups */}
        <div className="rounded-2xl p-5" style={{background:'var(--surface)', border:'1px solid var(--border)'}}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{color:'var(--accent)'}}>Today</p>
              <h2 className="font-display font-semibold" style={{color:'var(--text)'}}>Aaj ke Follow-ups</h2>
            </div>
            <Link href="/dashboard/followups" className="text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{background:'rgba(59,130,246,0.1)', color:'var(--accent)', border:'1px solid rgba(59,130,246,0.2)'}}>
              Sab →
            </Link>
          </div>
          {todayFollowUps.length === 0 ? (
            <div className="text-center py-8 rounded-xl" style={{background:'rgba(16,185,129,0.05)', border:'1px solid rgba(16,185,129,0.1)'}}>
              <p className="text-2xl mb-1">✦</p>
              <p className="text-sm font-medium" style={{color:'#34d399'}}>Sab clear hai!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayFollowUps.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl"
                  style={{background:'var(--surface2)', border:'1px solid var(--border)'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-display"
                      style={{background:'rgba(59,130,246,0.15)', color:'var(--accent)'}}>
                      {c.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{color:'var(--text)'}}>{c.name}</p>
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>{c.phone ?? "No phone"}</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/customers/${c.id}/edit`}
                    className="text-xs px-2.5 py-1 rounded-lg"
                    style={{background:'rgba(99,179,237,0.08)', color:'var(--text-muted)', border:'1px solid var(--border)'}}>
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Customers */}
        <div className="rounded-2xl p-5" style={{background:'var(--surface)', border:'1px solid var(--border)'}}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{color:'#06b6d4'}}>Recent</p>
              <h2 className="font-display font-semibold" style={{color:'var(--text)'}}>Naaye Customers</h2>
            </div>
            <Link href="/dashboard/customers" className="text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{background:'rgba(6,182,212,0.1)', color:'#06b6d4', border:'1px solid rgba(6,182,212,0.2)'}}>
              Sab →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm mb-3" style={{color:'var(--text-muted)'}}>Koi customer nahi abhi tak</p>
              <Link href="/dashboard/customers/add"
                className="btn-primary inline-block px-4 py-2 rounded-xl text-xs">
                Pehla Customer Add Karein
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl"
                  style={{background:'var(--surface2)', border:'1px solid var(--border)'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-display"
                      style={{background:'rgba(6,182,212,0.1)', color:'#06b6d4'}}>
                      {c.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{color:'var(--text)'}}>{c.name}</p>
                      <p className="text-xs" style={{color:'var(--text-muted)'}}>{c.source}</p>
                    </div>
                  </div>
                  <span className="status-badge" style={{background: STATUS_COLORS[c.status] ?? 'rgba(99,179,237,0.1)', color: STATUS_TEXT[c.status] ?? 'var(--text-muted)'}}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{background:'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.1))', border:'1px solid rgba(59,130,246,0.2)'}}>
        <div>
          <h3 className="font-display font-bold text-lg" style={{color:'var(--text)'}}>Naya Customer Add Karein</h3>
          <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>Koi lead miss na ho</p>
        </div>
        <Link href="/dashboard/customers/add"
          className="btn-primary px-5 py-2.5 rounded-xl text-sm whitespace-nowrap">
          ⊕ Add Customer
        </Link>
      </div>
    </div>
  );
}

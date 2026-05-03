import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen" style={{background:'var(--bg)'}}>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen fixed left-0 top-0 z-40"
        style={{background:'var(--surface)', borderRight:'1px solid var(--border)'}}>

        {/* Brand */}
        <div className="px-5 py-6" style={{borderBottom:'1px solid var(--border)'}}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{background:'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow:'0 0 20px rgba(59,130,246,0.3)'}}>
              <span className="text-sm">📱</span>
            </div>
            <div>
              <p className="font-display font-bold text-sm gradient-text">ApnaCRM</p>
              <p className="text-xs" style={{color:'var(--text-muted)'}}>WhatsApp CRM Lite</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Navbar mode="sidebar" userEmail={user.email ?? ""} />
        </nav>

        {/* User */}
        <div className="px-4 py-4" style={{borderTop:'1px solid var(--border)'}}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{background:'rgba(59,130,246,0.2)', color:'var(--accent)'}}>
              {(user.email ?? "U")[0].toUpperCase()}
            </div>
            <p className="text-xs truncate" style={{color:'var(--text-muted)'}}>{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="md:ml-60 pb-20 md:pb-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 px-4 py-3 flex items-center gap-3"
          style={{background:'rgba(8,12,18,0.9)', borderBottom:'1px solid var(--border)', backdropFilter:'blur(20px)'}}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{background:'linear-gradient(135deg, #3b82f6, #06b6d4)'}}>
            <span className="text-xs">📱</span>
          </div>
          <p className="font-display font-bold text-sm gradient-text">ApnaCRM</p>
        </header>

        <div className="px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 py-2"
        style={{background:'rgba(8,12,18,0.95)', borderTop:'1px solid var(--border)', backdropFilter:'blur(20px)'}}>
        <Navbar mode="bottom" userEmail={user.email ?? ""} />
      </nav>
    </div>
  );
}

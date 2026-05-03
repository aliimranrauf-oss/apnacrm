"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡", shortLabel: "Home" },
  { href: "/dashboard/customers", label: "Sab Customers", icon: "◈", shortLabel: "Customers" },
  { href: "/dashboard/customers/add", label: "Naya Customer", icon: "⊕", shortLabel: "Add" },
  { href: "/dashboard/followups", label: "Follow-ups", icon: "◷", shortLabel: "Follow-ups" },
];

export default function Navbar({ mode, userEmail }: { mode: "sidebar" | "bottom"; userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (mode === "sidebar") {
    return (
      <>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`nav-link ${active ? "active" : ""}`}>
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
        <button onClick={handleLogout}
          className="nav-link w-full mt-6"
          style={{color:'rgba(239,68,68,0.7)', cursor:'pointer', background:'none', border:'1px solid transparent'}}>
          <span className="text-base w-5 text-center">⎋</span>
          <span>Logout</span>
        </button>
      </>
    );
  }

  return (
    <div className="flex items-center justify-around">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all"
            style={{color: active ? 'var(--accent)' : 'var(--text-muted)'}}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-semibold uppercase tracking-wider font-display">{item.shortLabel}</span>
          </Link>
        );
      })}
      <button onClick={handleLogout}
        className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg"
        style={{color:'var(--text-muted)'}}>
        <span className="text-lg">⎋</span>
        <span className="text-[9px] font-semibold uppercase tracking-wider font-display">Exit</span>
      </button>
    </div>
  );
}

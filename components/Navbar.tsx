"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠", shortLabel: "Home" },
  { href: "/dashboard/customers", label: "Sab Customers", icon: "👥", shortLabel: "Customers" },
  { href: "/dashboard/customers/add", label: "Naya Customer", icon: "➕", shortLabel: "Add" },
  { href: "/dashboard/followups", label: "Aaj ke Follow-ups", icon: "📅", shortLabel: "Follow-ups" },
];

export default function Navbar({
  mode,
  userEmail,
}: {
  mode: "sidebar" | "bottom";
  userEmail: string;
}) {
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
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full mt-4"
        >
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </>
    );
  }

  return (
    <div className="flex items-center justify-around py-2">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
              active ? "text-green-600" : "text-gray-400"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.shortLabel}</span>
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-gray-400 transition-all"
      >
        <span className="text-xl">🚪</span>
        <span className="text-[10px] font-medium">Logout</span>
      </button>
    </div>
  );
}

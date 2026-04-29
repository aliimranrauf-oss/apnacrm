import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar – desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
            <span className="text-lg">📱</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight">ApnaCRM</p>
            <p className="text-xs text-gray-400">WhatsApp CRM Lite</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Navbar mode="sidebar" userEmail={user.email ?? ""} />
        </nav>
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-30">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span>📱</span>
          </div>
          <p className="font-bold text-gray-900">ApnaCRM</p>
        </header>

        <div className="px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom nav – mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <Navbar mode="bottom" userEmail={user.email ?? ""} />
      </nav>
    </div>
  );
}

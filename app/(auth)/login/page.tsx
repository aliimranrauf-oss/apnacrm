"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email ya password galat hai.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'var(--bg)'}}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div style={{position:'absolute', top:'-20%', left:'50%', transform:'translateX(-50%)', width:'600px', height:'600px', background:'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', borderRadius:'50%'}} />
        <div style={{position:'absolute', bottom:'10%', right:'10%', width:'300px', height:'300px', background:'radial-gradient(circle, rgba(6,182,212,0.04) 0%, transparent 70%)', borderRadius:'50%'}} />
      </div>

      <div className="w-full max-w-md relative animate-fadeUp">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{background:'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow:'0 0 40px rgba(59,130,246,0.4)'}}>
            <span className="text-2xl">📱</span>
          </div>
          <h1 className="text-3xl font-display font-bold gradient-text">ApnaCRM</h1>
          <p className="mt-2 text-sm" style={{color:'var(--text-muted)'}}>Pakistan ka #1 WhatsApp CRM</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{background:'var(--surface)', border:'1px solid var(--border)'}}>
          <h2 className="text-xl font-display font-semibold mb-6" style={{color:'var(--text)'}}>Login Karein</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="input-field px-4 py-3 rounded-xl text-sm"
                placeholder="aapka@email.com" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'var(--text-muted)'}}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input-field px-4 py-3 rounded-xl text-sm"
                placeholder="••••••••" required />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#f87171'}}>
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-sm mt-2">
              {loading ? "Login ho raha hai..." : "Login Karein →"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{color:'var(--text-muted)'}}>
            Pehli dafa?{" "}
            <Link href="/register" style={{color:'var(--accent)'}} className="font-semibold hover:underline">Account Banayein</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

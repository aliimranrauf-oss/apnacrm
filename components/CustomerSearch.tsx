"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

export default function CustomerSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    router.push(`/dashboard/customers?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="relative mb-4">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{color:'var(--text-dim)'}}>⌕</span>
      <input type="text" value={query} onChange={e => handleSearch(e.target.value)}
        className="input-field w-full pl-10 pr-10 py-3 rounded-xl text-sm"
        placeholder="Naam ya phone number se search karein..." />
      {query && (
        <button onClick={() => handleSearch("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm transition-all"
          style={{color:'var(--text-muted)'}}>✕</button>
      )}
    </div>
  );
}

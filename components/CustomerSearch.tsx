"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function CustomerSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      router.push(`/dashboard/customers?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="relative mb-4">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 transition bg-white"
        placeholder="Customer ka naam ya phone number dhundho..."
      />
      {query && (
        <button
          onClick={() => handleSearch("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!query.trim()) {
            return;
        }

        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }

    return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="buscar anime..."
        className="flex-1 bg-[#171717] border border-zinc-800 text-white text-base rounded px-3 py-2 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-600"
      />
      <button
        type="submit"
        className="bg-[#171717] border border-zinc-800 text-zinc-400 text-sm px-4 py-2 rounded hover:border-zinc-600 hover:text-white transition-colors"
      >
        Buscar
      </button>
    </form>
  )
}
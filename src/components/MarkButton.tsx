'use client'

import { useState } from 'react';

interface Props {
    animeId: number
    title: string
    imageUrl: string
    marked: boolean
    userId: string
}

export default function MarkButton({ animeId, title, imageUrl, marked: initialMarked }: Props) {
    const [marked, setMarked] = useState(initialMarked);
    const [loading, setLoading] = useState(false);

    async function toggle() {
        setLoading(true);

        if (marked) {
            await fetch(`/api/animes/${animeId}`, { method: 'DELETE' });
        } else {
            await fetch('/api/animes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ malId: animeId, title, imageUrl }),
            });
        }

        setMarked(!marked);
        setLoading(false);
    }

    return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full text-sm font-medium rounded py-2.5 transition-colors disabled:opacity-50 ${
        marked
          ? 'bg-[#171717] border border-zinc-800 text-zinc-400 hover:border-red-900 hover:text-red-400'
          : 'bg-white text-black hover:bg-zinc-200'
      }`}
    >
      {loading ? '...' : marked ? 'Parar de acompanhar' : 'Acompanhar novidades'}
    </button>
  )
}
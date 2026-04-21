'use client'

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSegmentState } from 'next/dist/next-devtools/userspace/app/segment-explorer-node';

interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  score: number | null;
  year: number | null;
}
export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [animes, setAnimes] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const search = useCallback(async (q: string) => {
      if (!q.trim()) {
        setAnimes([]);
        setOpen(false);
        return;
      }
      
      setLoading(true);

      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=6&sfw=true`);
      const data = await response.json();

      const unique = (data.data ?? []).filter(
        (anime: Anime, index: number, self: Anime[]) =>
          index === self.findIndex(a => a.mal_id === anime.mal_id)
      );

      setAnimes(unique);
      setOpen(unique.length > 0);
      setLoading(false);
    }, []);

    useEffect(() => {
      const timer = setTimeout(() => search(query), 500);
      return () => clearTimeout(timer);
    }, [query, search])

    function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!query.trim()) {
            return;
        }
        setOpen(false);

        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }

    return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => animes.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Buscar anime..."
          className="flex-1 bg-[#171717] border border-zinc-800 text-white text-base sm:text-sm rounded px-3 py-2.5 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-600"
        />
        <button
          type="submit"
          className="bg-[#171717] border border-zinc-800 text-zinc-400 text-sm px-4 py-2.5 rounded hover:border-zinc-600 hover:text-white transition-colors"
        >
          Buscar
        </button>
      </form>

      {open && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-[#171717] border border-zinc-800 rounded overflow-hidden z-50">
          {loading && (
            <li className="px-3 py-2 text-zinc-600 text-sm">Buscando...</li>
          )}
          {animes.map(anime => (
            <li key={anime.mal_id}>
              <Link
                href={`/anime/${anime.mal_id}`}
                className="flex gap-3 px-3 py-2 hover:bg-[#0f0f0f] transition-colors"
                onClick={() => setOpen(false)}
              >
                <div className="relative w-8 h-11 shrink-0 rounded overflow-hidden bg-[#0f0f0f]">
                  <Image
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <div className="flex flex-col gap-0.5 justify-center">
                  <span className="text-white text-sm leading-snug">{anime.title}</span>
                  {anime.score && (
                    <span className="text-zinc-500 text-xs">★ {anime.score}</span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
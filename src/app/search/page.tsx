import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';

interface Anime {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
    score: number | null;
    year: number | null;
    episodes: number | null;
    status: string;
}

async function searchAnimes(query: string): Promise<Anime[]> {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=20&sfw=true`, {
        next: { revalidate: 300},
    });
    
    const data = await response.json();
    return (data.data ?? []).filter(
      (anime: Anime, index: number, self: Anime[]) =>
        index === self.findIndex(a => a.mal_id === anime.mal_id)
    );
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    const { q } = await searchParams;
    const animes = q ? await searchAnimes(q): [];

  return (
    <main className="min-h-dvh bg-[#0f0f0f] px-4 py-6 max-w-lg mx-auto">
      <header className="mb-6">
        <a href="/" className="text-zinc-500 text-sm hover:text-white transition-colors">
          Home
        </a>
      </header>

      <div className="mb-6">
        <SearchBar />
      </div>

      {q && animes.length === 0 && (
        <p className="text-zinc-600 text-sm">nenhum resultado para "{q}"</p>
      )}

      {animes.length > 0 && (
        <ul className="flex flex-col gap-px">
          {animes.map(anime => (
            <li key={anime.mal_id}>
              <Link
                href={`/anime/${anime.mal_id}`}
                className="flex gap-3 py-3 border-b border-zinc-900 hover:bg-[#171717] -mx-4 px-4 transition-colors"
              >
                <div className="relative w-10 h-14 shrink-0 rounded overflow-hidden bg-[#171717]">
                  <Image
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div className="flex flex-col gap-0.5 justify-center">
                  <span className="text-white text-sm leading-snug">{anime.title}</span>
                  <div className="flex gap-2 items-center">
                    {anime.score && (
                      <span className="text-zinc-500 text-xs">★ {anime.score}</span>
                    )}
                    {anime.year && (
                      <span className="text-zinc-600 text-xs">{anime.year}</span>
                    )}
                    {anime.episodes && (
                      <span className="text-zinc-600 text-xs">{anime.episodes} ep</span>
                    )}
                    <span className="text-zinc-700 text-xs">{anime.status}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
import Image from 'next/image';
import Link from 'next/link';

interface Anime {
    mal_id: number;
    title: string;
    images: { jpg: { image_url: string } };
    score: number | null;
    episodes: number | null;
}

async function getCurrentAnimes(): Promise<Anime[]> {
    const response = await fetch('https://api.jikan.moe/v4/seasons/now?limit=24', {
        next: { revalidate: 3600 },
    });
    const data = await response.json();
    const unique = data.data?.filter((anime: Anime, index: number, self: Anime[]) =>
    index === self.findIndex(a => a.mal_id === anime.mal_id)
    ) ?? [];
    return unique;
}

export default async function AnimeGrid() {
    const animes = await getCurrentAnimes();

     return (
    <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
      {animes.map(anime => (
        <li key={anime.mal_id}>
          <Link href={`/anime/${anime.mal_id}`} className="flex flex-col gap-1 group">
            <div className="relative aspect-[2/3] rounded overflow-hidden bg-[#171717]">
              <Image
                src={anime.images.jpg.image_url}
                alt={anime.title}
                fill
                className="object-cover group-hover:opacity-80 transition-opacity"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
              />
            </div>
            <span className="text-zinc-400 text-xs leading-tight line-clamp-2 group-hover:text-white transition-colors">
              {anime.title}
            </span>
            {anime.score && (
              <span className="text-zinc-600 text-xs">{anime.score}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
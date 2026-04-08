import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import MarkButton from '@/components/MarkButton';

interface Anime {
    mal_id: number
    title: string
    synopsis: string | null
    score: number | null
    images: { jpg: { large_image_url: string } }
    episodes: number | null
    status: string
    year: number | null
    genres: { name: string }[]
}

async function getAnime(id: string): Promise<Anime> {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`, {
        next: { revalidate: 3600 },
    });
    const data = await response.json();
    console.log(data);
    return data.data;
}

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session) {
        redirect('/login');
    }

    const anime = await getAnime(id);

    const marked = await prisma.anime.findUnique({
        where: {
            userId_malId: {
                userId: session.user?.id as string,
                malId: anime.mal_id,            },
        },
    })

    return (
    <main className="min-h-dvh bg-[#0f0f0f] px-4 py-6 max-w-lg mx-auto">
      <header className="mb-6">
        <a href="/" className="text-zinc-500 text-sm hover:text-white transition-colors">
          ← Voltar
        </a>
      </header>

      <article className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="relative w-28 shrink-0 aspect-[2/3] rounded overflow-hidden bg-[#171717]">
            <Image
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>

          <div className="flex flex-col gap-1 justify-start pt-1">
            <h1 className="text-white text-base font-medium leading-snug">{anime.title}</h1>
            {anime.score && (
              <p className="text-zinc-400 text-sm">★ {anime.score}</p>
            )}
            {anime.year && (
              <p className="text-zinc-600 text-xs">{anime.year}</p>
            )}
            {anime.episodes && (
              <p className="text-zinc-600 text-xs">{anime.episodes} Episódios</p>
            )}
            <p className="text-zinc-600 text-xs">{anime.status}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {anime.genres.map(g => (
                <span key={g.name} className="text-xs text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {anime.synopsis && (
          <section>
            <h2 className="text-zinc-400 text-xs mb-2">Sinopse</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{anime.synopsis}</p>
          </section>
        )}

        <MarkButton animeId={anime.mal_id} title={anime.title} imageUrl={anime.images.jpg.large_image_url} marked={!!marked} userId={session.user.id} />
      </article>
    </main>
  )
}
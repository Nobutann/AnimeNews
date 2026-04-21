import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AnimeGrid from '@/components/AnimeGrid';
import SearchBar from '@/components/SearchBar';

export default async function HomePage() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  return (
    <main className="min-h-dvh bg-[#0f0f0f] px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-white text-lg font-medium">anime-news</h1>
        <a href="/profile" className="text-zinc-500 text-sm hover:text-white transition-colors">
          {session.user?.name}
        </a>
      </header>

      <section className="mb-6">
        <SearchBar />
      </section>

      <section>
        <h2 className="text-zinc-400 text-sm mb-4">lançando agora</h2>
        <AnimeGrid />
      </section>
    </main>
  )
}
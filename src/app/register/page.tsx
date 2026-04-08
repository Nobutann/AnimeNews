'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
            setLoading(false);
            return;
        }

        router.push('/login');
    }

    return (
    <main className="min-h-dvh bg-[#0f0f0f] flex items-center justify-center px-4">
      <section className="w-full max-w-sm">
        <header className="mb-6">
          <h1 className="text-white text-lg font-medium">Anime News</h1>
          <p className="text-zinc-500 text-sm mt-1">Crie sua conta!</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-zinc-400 text-sm">
              nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="bg-[#171717] border border-zinc-800 text-white text-base rounded px-3 py-2 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-zinc-400 text-sm">
              email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="bg-[#171717] border border-zinc-800 text-white text-base rounded px-3 py-2 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-zinc-400 text-sm">
              senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="bg-[#171717] border border-zinc-800 text-white text-base rounded px-3 py-2 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {error && (
            <p role="alert" className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#171717] border border-zinc-800 text-white text-sm py-2 rounded hover:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'criando conta...' : 'criar conta'}
          </button>
        </form>

        <footer className="mt-6">
          <p className="text-zinc-600 text-sm">
            Já tem conta?{' '}
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors">
              Entrar!
            </Link>
          </p>
        </footer>
      </section>
    </main>
  )
}
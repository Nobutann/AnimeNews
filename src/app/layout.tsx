import type { Metadata } from 'next';
import './globals.css';
import PushSubscriber from '@/components/PushSubscriber';

export const metadata: Metadata = {
  title: 'Anime News',
  description: 'Acompanhe seus animes favoritos!',
};

export default function RootLayout({  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-[#0f0f0f] flex flex-col">
        {children}
        </body>
    </html>
  )
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { malId, title, imageUrl } = await req.json();

    if (!malId || !title) {
        return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const anime = await prisma.anime.create({
        data: {
            malId,
            title,
            imageUrl,
            userId: session.user?.id as string,
        },
    });

    return NextResponse.json(anime, { status: 201});
}
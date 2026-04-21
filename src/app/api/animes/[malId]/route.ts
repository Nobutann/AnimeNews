import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ malId: string }> }
) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { malId } = await params;

    await prisma.anime.delete({
        where: {
            userId_malId: {
                userId: session.user?.id as string,
                malId: parseInt(malId),
            },
        },
    })

    return NextResponse.json({ ok: true });
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Não autorizado'}, { status: 401 });
    }

    const { endpoint, keys } = await req.json();

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
        return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    await prisma.pushSubscription.upsert({
        where: { endpoint },
        update: {
            p256dh: keys.p256dh,
            auth: keys.auth,
        },
        create: {
            userId: session.user?.id as string,
            endpoint,
            p256dh: keys.p256dh,
            auth: keys.auth,
        },
    })

    return NextResponse.json({ ok: true });
}
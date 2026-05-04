import { NextResponse } from "next/server";
import webpush from 'web-push';
import { auth } from '@/lib/auth';
import { prisma } from "@/lib/prisma";

webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId: session.user?.id as string},
    });

    if (subscriptions.length === 0) {
        return NextResponse.json({ error: 'Nenhuma subscription encontrada' }, { status: 404 });
    }

    for (const sub of subscriptions) {
        await webpush.sendNotification(
            {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify({
                title: 'Anime News',
                body: 'Teste notificação',
                icon: '/icon.png',
                url: '/',
            })
        )
    }

    return NextResponse.json({ ok: true });
}
import cron from 'node-cron';
import webpush from 'web-push';
import { prisma } from './prisma';

webpush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

async function checkNewEpisodes() {
    const animes = await prisma.anime.findMany({
        include: { user: { include: { subscriptions: true } } },
    });

    for (const anime of animes) {
        try {
            const response = await fetch(`https://api.jikan.moe/v4/anime/${anime.malId}`);
            const data = await response.json();
            const info = data.data;

            if (!info) {
                continue;
            }

            const latestEpisode = info.episodes ?? 0;
            const latestSeason = info.season ?? null;
            
            const hasNewEpisode = 
            anime.lastNotifiedEpisode !== null && latestEpisode > (anime.lastNotifiedEpisode ?? 0);

            const hasNewSeason = 
            anime.lastNotifiedSeason !== null && latestSeason && latestSeason !== anime.lastNotifiedSeason;

            const isNewRelease = 
            anime.lastNotifiedEpisode === null && latestEpisode > 0;

            if (!hasNewEpisode && !hasNewSeason && !isNewRelease) {
                continue;
            }

            let title = anime.title;
            let body = '';

            if (isNewRelease) {
                body = 'O anime estreou';
            } else if (hasNewSeason) {
                body  = 'Nova temporada disponível';
            } else {
                body = `Épisódio ${latestEpisode} disponível`;
            }

            for (const subscriptions of anime.user.subscriptions) {
                try {
                    await webpush.sendNotification(
                        {
                            endpoint: subscriptions.endpoint,
                            keys: {
                                p256dh: subscriptions.p256dh,
                                auth: subscriptions.auth,
                            },
                        },
                        JSON.stringify({
                            title,
                            body,
                            icon: '/icon.png',
                            url: `/anime/${anime.malId}`,
                        })
                    )
                } catch {
                    await prisma.pushSubscription.delete({
                        where: { endpoint: subscriptions.endpoint },
                    });
                }
            }

            await prisma.anime.update({
                where: { id: anime.id },
                data: {
                    lastNotifiedEpisode: latestEpisode,
                    lastNotifiedSeason: latestSeason,
                },
            })
        } catch {
            continue;
        }
    }
}

let started = false;

export function startCron() {
    if (started) {
        return;
    }

    cron.schedule('0 * * * *', checkNewEpisodes);
    console.log('cron job iniciado');
}
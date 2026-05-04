'use client'

import { useEffect } from "react";

export default function PushSubscriber() {
    useEffect(() => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            return;
        }

        async function subscribe() {
            const permission = await Notification.requestPermission();
            
            if (permission !== 'granted') {
                return;
            }

            const registration = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            const existing = await registration.pushManager.getSubscription();

            if (existing) {
                await saveSubscription(existing);
                return;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
            });

            await saveSubscription(subscription);
        }

        async function saveSubscription(subscription: PushSubscription) {
            const { endpoint, keys } = subscription.toJSON() as {
                endpoint: string;
                keys: { p256dh: string; auth: string };
            };

            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint, keys }),
            });
        }

        subscribe();
    }, []);

    return null;
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
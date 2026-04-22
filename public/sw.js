self.addEventListener('push', function (event) {
    if (!event.data) {
        return;
    }

    const data = event.data.json();

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon ?? '/icon.png',
            badge: data.badge ?? 'icon.png',
            data: { url: data.url },
        })
    )
})

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    if (event.notification.data?.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        )
    }
})
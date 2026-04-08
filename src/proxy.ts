import { auth } from '@/lib/auth'
import { isatty } from 'tty';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

    if (!isLoggedIn && !isAuthPage) {
        return Response.redirect(new URL('/login', req.nextUrl));
    }

    if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/', req.nextUrl));
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
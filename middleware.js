// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones below
//      */
//     '/((?!api|login|admin|styles|img|scripts|_vercel|favicon\\.svg|config\\.yml).*)',
//   ],
// };

// export default function middleware(request) {
//   const url = new URL(request.url);

//   // EXEMPTION: If the path includes /admin/ or /api/, let it pass through
//   // This is a second layer of defense for the matcher above
//   if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api') || url.pathname.includes('config.yml')) {
//     return;
//   }

//   const hasCookie = request.headers.get('cookie')?.includes('vk_auth_token');

//   if (!hasCookie && url.pathname !== '/login') {
//     url.pathname = '/login';
//     return Response.redirect(url, 302);
//   }
// }
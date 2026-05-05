// export const config = {
//   matcher: [
//     /*
//      * Match all request paths EXCEPT for the ones starting with:
//      * - api (where our secure login verification function will live)
//      * - login (the frontend login page itself)
//      * - styles, img, scripts (static assets needed to make the login page look beautiful)
//      * - _vercel (Vercel system internals)
//      * - favicon.svg (the tab icon)
//      */
//     '/((?!api|login|admin|styles|img|scripts|_vercel|favicon\\.svg).*)',
//   ],
// };

// export default function middleware(request) {
//   const url = new URL(request.url);

//   // Check the request headers for our custom authentication cookie
//   const hasCookie = request.headers.get('cookie')?.includes('vk_auth_token');

//   // If the cookie is missing, immediately redirect them to the login page
//   if (!hasCookie) {
//     url.pathname = '/login';
//     return Response.redirect(url, 302);
//   }

//   // If the cookie is present, do nothing and let the request load the digital garden normally
// }


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones below
     */
    '/((?!api|login|admin|styles|img|scripts|_vercel|favicon\\.svg|config\\.yml).*)',
  ],
};

export default function middleware(request) {
  const url = new URL(request.url);

  // EXEMPTION: If the path includes /admin/ or /api/, let it pass through
  // This is a second layer of defense for the matcher above
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api') || url.pathname.includes('config.yml')) {
    return;
  }

  const hasCookie = request.headers.get('cookie')?.includes('vk_auth_token');

  if (!hasCookie && url.pathname !== '/login') {
    url.pathname = '/login';
    return Response.redirect(url, 302);
  }
}
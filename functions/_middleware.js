export async function onRequest(context) {
  const url = new URL(context.request.url);
  const hostname = url.hostname;

  if (hostname === 'actone.iyal.ink') {
    if (url.pathname === '/') {
      url.pathname = '/actone/';
    } else if (!url.pathname.startsWith('/actone/')) {
      url.pathname = `/actone${url.pathname}`;
    }
    return context.env.ASSETS.fetch(url);
  }

  if (hostname === 'fount.iyal.ink' || hostname === 'founttui.iyal.ink') {
    if (url.pathname === '/') {
      url.pathname = '/fount/';
    } else if (!url.pathname.startsWith('/fount/')) {
      url.pathname = `/fount${url.pathname}`;
    }
    return context.env.ASSETS.fetch(url);
  }

  return context.next();
}

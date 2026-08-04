export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Route actone.iyal.ink to the /actone directory
  if (url.hostname === 'actone.iyal.ink' && !url.pathname.startsWith('/actone')) {
    url.pathname = `/actone${url.pathname}`;
    // If the path is just /actone/ we need to serve /actone/index.html implicitly, 
    // but Cloudflare ASSETS.fetch handles directory indexes automatically.
    return context.env.ASSETS.fetch(url);
  }

  // Route fount.iyal.ink to the /fount directory
  if (url.hostname === 'fount.iyal.ink' && !url.pathname.startsWith('/fount')) {
    url.pathname = `/fount${url.pathname}`;
    return context.env.ASSETS.fetch(url);
  }

  // Proceed as normal for iyal.ink and www.iyal.ink
  return context.next();
}

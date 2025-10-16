import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { localeUtils } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: [
    // Exclude static files and API routes
    '/((?!api|trpc|_next|_vercel|.*\\..*|.*@.*).*)',
    // Include locale-specific paths
    '/([a-z]{2}(?:-[A-Z]{2})?)/(.*)'
  ]
};

// Custom locale detection middleware
export async function customLocaleMiddleware(request: Request) {
  const { pathname } = new URL(request.url);
  
  // Skip API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
    return;
  }
  
  // Check if path already contains a locale
  const existingLocale = localeUtils.extractLocaleFromPath(pathname);
  
  if (existingLocale) {
    // Validate the existing locale
    if (!localeUtils.isSupported(existingLocale)) {
      // Redirect to default locale if invalid
      const redirectUrl = new URL(`/${routing.defaultLocale}${pathname}`, request.url);
      return Response.redirect(redirectUrl, 301);
    }
    return; // Valid locale, proceed
  }
  
  // Try to detect user's preferred locale from headers
  const acceptLanguage = request.headers.get('accept-language') || '';
  const preferredLocale = localeUtils.getBestLocale(acceptLanguage);
  
  // If preferred locale is different from default, redirect to it
  if (preferredLocale !== routing.defaultLocale && routing.localePrefix === 'as-needed') {
    const redirectUrl = new URL(`/${preferredLocale}${pathname}`, request.url);
    return Response.redirect(redirectUrl, 302);
  }
  
  // Default: use default locale without prefix
  return;
}

// Enhanced locale handling for different scenarios
export async function handleLocaleRedirect(request: Request, locale: string) {
  const { pathname, search, hash } = new URL(request.url);
  const redirectUrl = new URL(
    `/${locale}${pathname}${search}${hash}`,
    request.url
  );
  
  return Response.redirect(redirectUrl, 302);
}

// SEO-friendly locale handling
export function getCanonicalUrl(request: Request, locale: string): string {
  const { origin, pathname, search, hash } = new URL(request.url);
  
  if (locale === routing.defaultLocale && routing.localePrefix === 'as-needed') {
    return `${origin}${pathname}${search}${hash}`;
  }
  
  return `${origin}/${locale}${pathname}${search}${hash}`;
}
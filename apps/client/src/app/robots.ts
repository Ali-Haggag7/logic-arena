import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.CLIENT_URL || 'https://logicarena.dev';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/arena', '/dashboard', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

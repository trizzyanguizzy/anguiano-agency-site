import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/', '/meals', '/family'] },
    sitemap: 'https://tristananguiano.com/sitemap.xml',
  };
}

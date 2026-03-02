import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/experience', '/skills', '/projects', '/contact'].map(
    (route) => ({
      url: `${SITE_CONFIG.url}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: (route === '/projects' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 1 : route === '/contact' ? 0.5 : 0.8,
    })
  );

  return routes;
}

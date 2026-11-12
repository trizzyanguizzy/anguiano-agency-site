import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://tristananguiano.com', lastModified: new Date() }];
}

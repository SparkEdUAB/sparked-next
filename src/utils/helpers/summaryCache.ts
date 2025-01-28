import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL
});

redis.connect().catch(console.error);

export async function getCachedSummary(contentId: string): Promise<string | null> {
  try {
    return await redis.get(`summary:${contentId}`);
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

export async function cacheSummary(contentId: string, summary: string, ttl = 604800): Promise<void> {
  try {
    await redis.setEx(`summary:${contentId}`, ttl, summary);
  } catch (error) {
    console.error('Cache storage error:', error);
  }
}
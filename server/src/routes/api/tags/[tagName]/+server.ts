import { db } from '$lib/server/db';
import { samples, tags, tagsToSamples } from '$schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';

export const DELETE = async ({ params }: RequestEvent) => {
  try {
    Promise.all([
      await db.delete(tagsToSamples).where(eq(tagsToSamples.tagName, params.tagName)),
      await db.delete(tags).where(eq(tags.name, params.tagName)),
      await db
        .update(samples)
        .set({ primaryTagName: null })
        .where(eq(samples.primaryTagName, params.tagName))
    ]);
  } catch {
    return new Response('Failed to delete tag', { status: 500 });
  }

  return new Response('Tag deleted', { status: 200 });
};

export const PATCH = async ({ params, request }: RequestEvent) => {
  try {
    const newTag = await request.json();
    Promise.all([
      await db.update(tags).set(newTag).where(eq(tags.name, params.tagName)),
      await db
        .update(tagsToSamples)
        .set({ tagName: newTag.name })
        .where(eq(tagsToSamples.tagName, params.tagName)),
      await db
        .update(samples)
        .set({ primaryTagName: newTag.name })
        .where(eq(samples.primaryTagName, params.tagName))
    ]);
    return new Response('Tag updated', { status: 200 });
  } catch {
    return new Response('Failed to update tag', { status: 500 });
  }
};

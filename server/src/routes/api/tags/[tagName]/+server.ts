import { db } from "$lib/server/db"
import { samples, tags, tagsToSamples } from "$schema"
import { eq } from "drizzle-orm"
import type { RequestEvent } from "./$types";


export const DELETE = async ({ params }: RequestEvent) => {

  try {
    await db.delete(tagsToSamples).where(eq(tagsToSamples.tagName, params.tagName));
    await db.delete(tags).where(eq(tags.name, params.tagName));
    await db.update(samples).set({primaryTagName: null}).where(eq(samples.primaryTagName, params.tagName));
  } catch {
    return new Response('Failed to delete tag', { status: 500 });
  }

  return new Response('Tag deleted', { status: 200 });

}

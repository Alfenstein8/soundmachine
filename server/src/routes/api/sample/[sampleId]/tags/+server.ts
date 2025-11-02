import { db } from '$lib/server/db';
import { tagsToSamples, tags, type TagSelect, samples } from '$schema';
import { and, eq, getTableColumns, notInArray } from 'drizzle-orm';
import type { RequestEvent } from './$types';

const tagColumns = getTableColumns(tags);
export const GET = async ({ params }: RequestEvent) => {
  try {
    const tagList: TagSelect[] = await db
      .select({ ...tagColumns })
      .from(tagsToSamples)
      .innerJoin(tags, eq(tagsToSamples.tagName, tags.name))
      .where(eq(tagsToSamples.sampleId, params.sampleId));

    return new Response(JSON.stringify(tagList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response('Failed to fetch tags for sample', { status: 500 });
  }
};

export const POST = async ({ params, request }: RequestEvent) => {
  let res: { tagNames: string[], primaryTagName: string };
  let tagNames: string[];
  let primaryTagName: string;
  try {
    res = await request.json();
    tagNames = res.tagNames;
    primaryTagName = res.primaryTagName;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  try {
    // Delete tags
    if (tagNames.length > 0) {
      await db
        .delete(tagsToSamples)
        .where(
          and(
            eq(tagsToSamples.sampleId, params.sampleId),
            notInArray(tagsToSamples.tagName, tagNames)
          )
        );
    } else {
      await db.delete(tagsToSamples).where(eq(tagsToSamples.sampleId, params.sampleId));
    }

    // Insert tags
    const newTags = tagNames.map((tagName) => ({ tagName, sampleId: params.sampleId }));
    if (newTags.length > 0) {
      await db.insert(tagsToSamples).values(newTags).onConflictDoNothing();
    }

    // Update primary tag
    try {
      await db.update(samples).set({ primaryTagName }).where(eq(samples.id, params.sampleId));
    } catch {
      return new Response('Failed to update primary tag', { status: 500 });
    }
  } catch {
    return new Response('Failed to associate tag with sample', { status: 500 });
  }
  return new Response('Tag associated with sample', { status: 201 });
};

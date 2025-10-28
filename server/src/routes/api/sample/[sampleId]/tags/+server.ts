import { db } from '$lib/server/db';
import { tagsToSamples, tags, type TagSelect } from '$schema';
import { eq, or } from 'drizzle-orm';
import type { RequestEvent } from './$types';

export const GET = async ({ params }: RequestEvent) => {
  try {
    const tagsRelations = await db
      .select()
      .from(tagsToSamples)
      .where(eq(tagsToSamples.sampleId, params.sampleId));
    const wheres = tagsRelations.map((relation) => eq(tags.name, relation.tagName));
    const tagList = await db
      .select()
      .from(tags)
      .where(or(...wheres));
    return new Response(JSON.stringify(tagList), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response('Failed to fetch tags for sample', { status: 500 });
  }
};

export const POST = async ({ params, request }: RequestEvent) => {
  let tagData: TagSelect;
  try {
    tagData = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  try {
    await db.insert(tagsToSamples).values({
      tagName: tagData.name,
      sampleId: params.sampleId
    });
  } catch {
    return new Response('Failed to associate tag with sample', { status: 500 });
  }
  return new Response('Tag associated with sample', { status: 201 });
};

import { db } from '$lib/server/db';
import { tags, type TagSelect } from '$schema';
import type { RequestEvent } from './$types';

export const GET = async () => {
  let tagList: TagSelect[] = [];
  try {
    tagList = await db.select().from(tags);
  } catch {
    return new Response('Failed to fetch tags', { status: 500 });
  }

  return new Response(JSON.stringify(tagList), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const POST = async ({ request }: RequestEvent) => {
  let tagData: TagSelect;
  try {
    tagData = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }
  try {
    await db.insert(tags).values(tagData);
  } catch {
    return new Response('Failed to create tag', { status: 500 });
  }
  return new Response('Tag created', { status: 201 });
};

export const DELETE = async () => {
  try {
    await db.delete(tags);
  } catch {
    return new Response('Failed to delete tags', { status: 500 });
  }
  return new Response('All tags deleted', { status: 200 });
};

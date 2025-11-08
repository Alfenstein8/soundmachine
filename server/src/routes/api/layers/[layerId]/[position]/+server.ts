import { db } from '$lib/server/db';
import { layers, slots, type SlotInsert } from '$schema';
import { and, eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';

export const PUT = async ({ params, request }: RequestEvent) => {
  const layerId = Number(params.layerId);
  const position = Number(params.position);
  let slot: SlotInsert;

  try {
    slot = await request.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (isNaN(position) || position <= 0 || !Number.isInteger(position)) {
    return new Response('Invalid position', { status: 400 });
  }

  try {
    const layer = await db.select().from(layers).limit(1);
    if (layer.length === 0) {
      return new Response('Layer not found', { status: 404 });
    }
    await db
      .insert(slots)
      .values(slot)
      .onConflictDoUpdate({
        target: [slots.layerId, slots.position],
        set: slot
      });
  } catch {
    return new Response('Failed to update slot', { status: 500 });
  }

  return new Response(null, { status: 204 });
};

export const DELETE = async ({ params }: RequestEvent) => {
  const layerId = Number(params.layerId);
  const position = Number(params.position);
  if (isNaN(position) || position < 0 || !Number.isInteger(position)) {
    return new Response('Invalid position', { status: 400 });
  }
  try {
    await db.delete(slots).where(and(eq(slots.layerId, layerId), eq(slots.position, position)));
  } catch {
    return new Response('Failed to delete slot', { status: 500 });
  }
  return new Response(null, { status: 204 });
};

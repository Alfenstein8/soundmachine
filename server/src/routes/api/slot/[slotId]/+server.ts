import { db } from '$lib/server/db';
import { slots, type SlotInsert } from '$schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';

export const PATCH = async ({ params, request }: RequestEvent) => {
  const slotId = Number(params.slotId);
  const slot: SlotInsert = await request.json();

  if (isNaN(slotId) || slotId <= 0 || slotId > 64 || !Number.isInteger(slotId)) {
    return new Response('Invalid slot ID', { status: 400 });
  }

  try {
    await db.update(slots).set(slot).where(eq(slots.id, slotId));
  } catch {
    return new Response('Failed to update slot', { status: 500 });
  }

  return new Response(null, { status: 204 });
};

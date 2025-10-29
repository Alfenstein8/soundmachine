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

  await db.update(slots).set(slot).where(eq(slots.id, slotId));

  return new Response(null, { status: 204 });
};

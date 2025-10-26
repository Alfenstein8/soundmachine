import { db } from '$lib/server/db';
import { slots } from '$schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from './$types';

export const POST = async ({ params }: RequestEvent) => {
  const slotId = Number(params.slotId);

  if (isNaN(slotId) || slotId <= 0 || slotId > 64 || !Number.isInteger(slotId)) {
    return new Response('Invalid slot ID', { status: 400 });
  }

  await db.update(slots).set({ sampleId: null }).where(eq(slots.id, slotId));

  return new Response(null, { status: 204 });
};

import { db } from '$lib/server/db';
import { samples, slots } from '$schema';

export const GET = async () => {
  const resSlots = await db.select().from(slots);
  const resSamples = await db.select().from(samples);

  return new Response(JSON.stringify({ slots: resSlots, samples: resSamples }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

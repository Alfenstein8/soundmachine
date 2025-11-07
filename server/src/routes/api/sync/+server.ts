import { db } from '$lib/server/db';
import { layers, samples, slots } from '$schema';

export const GET = async () => {
  const resSlots = await db.select().from(slots);
  const resSamples = await db.select().from(samples);
  const resLayers = await db.select().from(layers);

  return new Response(JSON.stringify({ slots: resSlots, samples: resSamples, layers: resLayers }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

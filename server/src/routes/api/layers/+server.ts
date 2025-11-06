import { db } from '$lib/server/db';
import { layers, type LayerInsert } from '$schema';
import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import { createLayer } from '$lib/server/db/utils';

export const GET = async () => {
  try {
    const allLayers = await db.select().from(layers);
    return json(allLayers);
  } catch (error) {
    console.error('Error fetching layers:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST = async ({ request }: RequestEvent) => {
  let layer: LayerInsert;
  try {
    layer = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  try {
    await createLayer(layer);
    return new Response('Layer created', { status: 201 });
  } catch (error) {
    console.error('Error creating layer:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};

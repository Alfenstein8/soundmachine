import * as db from '$db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    samples: await db.getAllSamples(),
    slots: await db.getAllSlots(),
    tags: await db.getAllTags(),
    tagAttachments: await db.getAllTagAttachments(),
    layers: await db.getAllLayers()
  };
};

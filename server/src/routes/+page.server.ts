import { db } from "$lib/server/db";
import { samples, slots, tags } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  return {
    samples: await db.select().from(samples),
    slots: await db.select().from(slots),
    tags: await db.select().from(tags)
  }
}

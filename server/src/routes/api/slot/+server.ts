import { db } from "$lib/server/db"
import { slots } from "$schema"
import { json } from "@sveltejs/kit";


export const GET = async () => {
  const allSlots = await db.select().from(slots);
  return json(allSlots)
}

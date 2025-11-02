import { db } from "$lib/server/db"
import { tagsToSamples } from "$schema"
import { json } from "@sveltejs/kit";


export const GET = async ()=> {

  const tagAttachments = await db.select().from(tagsToSamples);
  return json(tagAttachments);
}

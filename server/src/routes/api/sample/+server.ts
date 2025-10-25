import { db } from "$lib/server/db";
import type { RequestEvent } from "./$types";
import { samples } from "$lib/server/db/schema";

export const POST = async ({ request }: RequestEvent) => {

  const res = await db.insert(samples).values({}).returning()
  Bun.write(res[0].id, "\n");
}

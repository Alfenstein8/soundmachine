import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { DATABASE_URL } from '$app/env/private';

const sqlite = new Database(DATABASE_URL);

export const db = drizzle(sqlite, { schema });

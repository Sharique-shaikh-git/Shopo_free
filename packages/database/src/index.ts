import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars if they aren't loaded by the consumer app
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Global postgres client so we don't exhaust pool during hot-reloads
const globalForDb = globalThis as unknown as {
  postgresClient: postgres.Sql | undefined;
};

const client = globalForDb.postgresClient ?? postgres(connectionString);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.postgresClient = client;
}

export const db = drizzle(client, { schema });

// Export everything from schema so consuming apps have the types
export * from './schema';
export * from 'drizzle-orm';

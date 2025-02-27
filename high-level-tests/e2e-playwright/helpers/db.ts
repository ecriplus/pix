import Knex from 'knex';

// @ts-expect-error Get database-builder from API project
import { DatabaseBuilder } from '../../../api/db/database-builder/database-builder.js';

const knex = Knex({ client: 'postgresql', connection: process.env.DATABASE_URL });

export const databaseBuilder = await DatabaseBuilder.create({ knex });

export async function cleanDB() {
  await databaseBuilder.emptyDatabase();
}

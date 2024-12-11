export const BASE_PATH = process.env.BASE_PATH ? process.env.BASE_PATH : '';
export const PORT = process.env.PORT ? process.env.PORT : '3100';


export const PG_SCHEMA = process.env.PG_SCHEMA;
export const PG_USER = process.env.PG_USER;
export const PG_HOST = process.env.PG_HOST;
export const PG_DATABASE = process.env.PG_DATABASE;
export const PG_PASSWORD = process.env.PG_PASSWORD;
export const PG_PORT = Number(process.env.PG_PORT) || 5432;
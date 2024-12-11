import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from "../../config/constants";
import { Pool } from 'pg';


export class DatabaseInitializer {
    private static instance: Pool;

    // public static getInstance(): DatabaseInitializer {
    //     if (!DatabaseInitializer.instance) {
    //         DatabaseInitializer.instance = new DatabaseInitializer();
    //     }
    //     return DatabaseInitializer.instance;
    // }

    private constructor() {
    }

    public static start() {
        console.log('Initializing database module...');
        if (!DatabaseInitializer.instance) {
            DatabaseInitializer.instance = new Pool({
                user: PG_USER,
                host: PG_HOST,
                database: PG_DATABASE,
                password: PG_PASSWORD,
                port: PG_PORT,
            });
        }
    }

    public static async getClient() {
        if (!DatabaseInitializer.instance) {
            throw new Error(`Database pool not yet initialized.`);
        }
        const client = await DatabaseInitializer.instance.connect();
        return client;
    }

    public static async close() {
        console.log('shutting down');
        if (DatabaseInitializer.instance) {
            try {
                await DatabaseInitializer.instance.end();
                console.log('Database pool closed.')
                DatabaseInitializer.instance = null;
            } catch (error) {
                throw new Error(`Could not close connection pool: ${error}`);
            }
        }
    }
}
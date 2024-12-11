import { PoolClient, QueryResult } from "pg";
import { DatabaseInitializer } from "./database-initializer";

export class DatabaseService {
    private static instance: DatabaseService;

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    public async executeStatement<T>(sql: string, values = undefined): Promise<QueryResult<T>> {
        const dbConn = await DatabaseInitializer.getClient();
        let result: QueryResult<T>;

        console.log('Execute statement...', { sql, values });

        try {
            result = await dbConn.query(sql, values)
        } catch (error) {
            console.error(`Error executing database query:`, error);
            throw error;
        } finally {
            await this.handleCloseConnection(dbConn);
        }
        return result;
    }

    public handleCloseConnection(connection: PoolClient) {
        if (connection) {
            try {
                connection.release();
            } catch (error) {
                console.error(`Could not release client from pool:`, error);
                throw error;
            }
        }
    }
}
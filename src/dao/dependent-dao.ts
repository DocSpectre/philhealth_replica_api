import { PG_SCHEMA } from "../../config/constants";
import { DependentFull } from "../model/api/dependent-api";
import { DEPENDENT_COLUMNS } from "../model/db/dependent-table";
import { DB_TABLE } from "../model/db/table";
import { buildDependentDataFromDTO, buildDependentDTOFromData, DependentDTO } from "../model/dto/dependent-dto";
import { DatabaseService } from "../service/database-service";
import { getCleanObject } from "../util/ts-utils";

export class DependentDAO {

    private databaseService: DatabaseService;
    private static instance: DependentDAO;

    constructor() {
        this.databaseService = DatabaseService.getInstance();
    }

    public static getInstance(): DependentDAO {
        if (!DependentDAO.instance) {
            DependentDAO.instance = new DependentDAO();
        }
        return DependentDAO.instance;
    }

    private getSQLCreateDependent(dependentDTO: DependentDTO) {
        let insertColumn = '';
        let insertValue = '';

        Object.keys(dependentDTO).forEach((key, index) => {
            if (insertColumn.length > 0) {
                insertColumn += ', ';
                insertValue += ', ';
            }

            insertColumn += `${key}`;
            insertValue += `$${index + 1}`;
        });

        const sqlStatement = `
        INSERT INTO ${PG_SCHEMA}.${DB_TABLE.DEPENDENT_TABLE} (
            ${insertColumn}
        ) VALUES (${insertValue})
        `
        return sqlStatement;
    }

    private getSQLFetchDependentById() {
        let statement = `
        SELECT * FROM ${DB_TABLE.DEPENDENT_TABLE}
        WHERE ${DEPENDENT_COLUMNS.DEPENDENT_ID} = $1
       `;
        return statement;
    }

    private getSQLFetchMultipleDependent() {
        let statement = `
        SELECT * FROM ${DB_TABLE.DEPENDENT_TABLE}
        LIMIT $1 OFFSET $2
       `;
        return statement;
    }

    private getSQLUpdateDependent(dependentDTO: DependentDTO) {
        let updateColumn = '';
        let primKeyIdx = null;

        Object.keys(dependentDTO).forEach((key, index) => {
            if (key === DEPENDENT_COLUMNS.DEPENDENT_ID) {
                primKeyIdx = index + 1;
                return;
            }

            if (updateColumn.length > 0) {
                updateColumn += ', ';
            }

            updateColumn += `${key} = `;
            updateColumn += `$${index + 1}`;
        });

        if (primKeyIdx === null) {
            throw new Error(`Failed to update dependent table. Unknown PK value`);
        }
        const sqlStatement = `
        UPDATE ${PG_SCHEMA}.${DB_TABLE.DEPENDENT_TABLE}
        SET ${updateColumn}
        WHERE ${DEPENDENT_COLUMNS.DEPENDENT_ID} = $${primKeyIdx}
        `
        return sqlStatement;
    }

    private getSQLDeleteDependent() {
        `DELETE FROM dependent
WHERE 
    dependent_number = $1; -- Placeholder for dependent_number
`
    }



    public async create(dependentData?: DependentFull) {
        const dependentDTO = buildDependentDTOFromData(dependentData);

        if (dependentDTO === null) {
            throw new Error(`DEPENDENT-DAO: Unable to create db values.`);
        }

        const query = this.getSQLCreateDependent(dependentDTO);
        const values = Object.values(dependentData);
        const result = await this.databaseService.executeStatement(query, values);
        return result;
    }

    // Get dependents with pagination
    public async findAll(limit: number, offset: number) {
        const query = this.getSQLFetchMultipleDependent();
        const result = await this.databaseService.executeStatement<DependentDTO>(query, [limit, offset]);
        const dependentList: DependentDTO[] | undefined = result.rows;
        if (dependentList === undefined || dependentList.length === 0) {
            return null;
        }

        const dependentDTO: DependentDTO[] = dependentList;
        const response = dependentDTO.map(obj => {
            getCleanObject(obj);
            return buildDependentDataFromDTO(obj);
        });
        return response;
    }

    // Get a single dependent by dependent_number
    public async findById(dependentId: number) {
        const query = this.getSQLFetchDependentById();
        const result = await this.databaseService.executeStatement(query, [dependentId]);
        const dependentList: DependentDTO[] | undefined = result.rows;
        if (dependentList === undefined || dependentList.length === 0) {
            return null;
        }

        const dependentDTO: DependentDTO[] = dependentList;
        const response = dependentDTO.map(obj => {
            getCleanObject(obj);
            return buildDependentDataFromDTO(obj);
        });
        return response;
    }

    // Update a dependent
    public async update(dependentData?: DependentFull): Promise<number> {
        const dependentDTO = buildDependentDTOFromData(dependentData);

        if (dependentDTO === null) {
            throw new Error(`DEPENDENT-DAO: Unable to create db values.`);
        }

        const query = this.getSQLUpdateDependent(dependentDTO);
        const values = Object.values(dependentData);
        const result = await this.databaseService.executeStatement(query, values);
        return result.rowCount;
    }

    // Delete a dependent
    public async delete(dependentId: number) {
        const query = `
            DELETE FROM dependents WHERE dependent_number = $1;
        `;
        const result = await this.databaseService.executeStatement(query, [dependentId]);
    }

}
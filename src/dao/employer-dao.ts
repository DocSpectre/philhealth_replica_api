import { PG_SCHEMA } from "../../config/constants";
import { EmployerFull } from "../model/api/employer-api";
import { EMPLOYER_COLUMNS } from "../model/db/employer-table";
import { DB_TABLE } from "../model/db/table";
import { buildEmployerDataFromDTO, buildEmployerDTOFromData, EmployerDTO } from "../model/dto/employer-dto";
import { DatabaseService } from "../service/database-service";
import { getCleanObject } from "../util/ts-utils";

export class EmployerDAO {

    private databaseService: DatabaseService;
    private static instance: EmployerDAO;

    constructor() {
        this.databaseService = DatabaseService.getInstance();
    }

    public static getInstance(): EmployerDAO {
        if (!EmployerDAO.instance) {
            EmployerDAO.instance = new EmployerDAO();
        }
        return EmployerDAO.instance;
    }

    private getSQLCreateEmployer(employerDTO: EmployerDTO) {
        let insertColumn = '';
        let insertValue = '';

        Object.keys(employerDTO).forEach((key, index) => {
            if (insertColumn.length > 0) {
                insertColumn += ', ';
                insertValue += ', ';
            }

            insertColumn += `${key}`;
            insertValue += `$${index + 1}`;
        });

        const sqlStatement = `
        INSERT INTO ${PG_SCHEMA}.${DB_TABLE.EMPLOYER_TABLE} (
            ${insertColumn}
        ) VALUES (${insertValue})
        `
        return sqlStatement;
    }

    private getSQLFetchEmployerById() {
        let statement = `
        SELECT * FROM ${DB_TABLE.EMPLOYER_TABLE}
        WHERE ${EMPLOYER_COLUMNS.EMPLOYER_NUMBER} = $1
       `;
        return statement;
    }

    private getSQLFetchMultipleEmployer() {
        let statement = `
        SELECT * FROM ${DB_TABLE.EMPLOYER_TABLE}
        LIMIT $1 OFFSET $2
       `;
        return statement;
    }

    private getSQLUpdateEmployer(employerDTO: EmployerDTO) {
        let updateColumn = '';
        let primKeyIdx = null;

        Object.keys(employerDTO).forEach((key, index) => {
            if (key === EMPLOYER_COLUMNS.EMPLOYER_NUMBER) {
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
            throw new Error(`Failed to update employer table. Unknown PK value`);
        }
        const sqlStatement = `
        UPDATE ${PG_SCHEMA}.${DB_TABLE.EMPLOYER_TABLE}
        SET ${updateColumn}
        WHERE ${EMPLOYER_COLUMNS.EMPLOYER_NUMBER} = $${primKeyIdx}
        `
        return sqlStatement;
    }

    private getSQLDeleteEmployer() {
        `DELETE FROM employer
WHERE 
    employer_number = $1; -- Placeholder for employer_number
`
    }



    public async create(employerData?: EmployerFull) {
        const employerDTO = buildEmployerDTOFromData(employerData);

        if (employerDTO === null) {
            throw new Error(`EMPLOYER-DAO: Unable to create db values.`);
        }

        const query = this.getSQLCreateEmployer(employerDTO);
        const values = Object.values(employerData);
        const result = await this.databaseService.executeStatement(query, values);
        return result;
    }

    // Get employers with pagination
    public async findAll(limit: number, offset: number) {
        const query = this.getSQLFetchMultipleEmployer();
        const result = await this.databaseService.executeStatement<EmployerDTO>(query, [limit, offset]);
        const employerList: EmployerDTO[] | undefined = result.rows;
        if (employerList === undefined || employerList.length === 0) {
            return null;
        }

        const employerDTO: EmployerDTO[] = employerList;
        const response = employerDTO.map(obj => {
            getCleanObject(obj);
            return buildEmployerDataFromDTO(obj);
        });
        return response;
    }

    // Get a single employer by employer_number
    public async findById(employerId: number) {
        const query = this.getSQLFetchEmployerById();
        const result = await this.databaseService.executeStatement(query, [employerId]);
        const employerList: EmployerDTO[] | undefined = result.rows;
        if (employerList === undefined || employerList.length === 0) {
            return null;
        }

        const employerDTO: EmployerDTO[] = employerList;
        const response = employerDTO.map(obj => {
            getCleanObject(obj);
            return buildEmployerDataFromDTO(obj);
        });
        return response;
    }

    // Update a employer
    public async update(employerData?: EmployerFull): Promise<number> {
        const employerDTO = buildEmployerDTOFromData(employerData);

        if (employerDTO === null) {
            throw new Error(`EMPLOYER-DAO: Unable to create db values.`);
        }

        const query = this.getSQLUpdateEmployer(employerDTO);
        const values = Object.values(employerData);
        const result = await this.databaseService.executeStatement(query, values);
        return result.rowCount;
    }

    // Delete a employer
    public async delete(employerId: number) {
        const query = `
            DELETE FROM employers WHERE employer_number = $1;
        `;
        const result =  await this.databaseService.executeStatement(query, [employerId]);
    }

}
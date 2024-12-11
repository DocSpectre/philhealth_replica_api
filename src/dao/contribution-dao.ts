import { PG_SCHEMA } from "../../config/constants";
import { ContributionFull } from "../model/api/contribution-api";
import { CONTRIBUTION_COLUMNS } from "../model/db/contribution-table";
import { DB_TABLE } from "../model/db/table";
import { buildContributionDataFromDTO, buildContributionDTOFromData, ContributionDTO } from "../model/dto/contribution-dto";
import { DatabaseService } from "../service/database-service";
import { getCleanObject } from "../util/ts-utils";


export class ContributionDAO {

    private databaseService: DatabaseService;
    private static instance: ContributionDAO;

    constructor() {
        this.databaseService = DatabaseService.getInstance();
    }

    public static getInstance(): ContributionDAO {
        if (!ContributionDAO.instance) {
            ContributionDAO.instance = new ContributionDAO();
        }
        return ContributionDAO.instance;
    }

    private getSQLCreateContribution(contributionDTO: ContributionDTO) {
        let insertColumn = '';
        let insertValue = '';

        Object.keys(contributionDTO).forEach((key, index) => {
            if (insertColumn.length > 0) {
                insertColumn += ', ';
                insertValue += ', ';
            }

            insertColumn += `${key}`;
            insertValue += `$${index + 1}`;
        });

        const sqlStatement = `
        INSERT INTO ${PG_SCHEMA}.${DB_TABLE.CONTRIBUTION_TABLE} (
            ${insertColumn}
        ) VALUES (${insertValue})
        `
        return sqlStatement;
    }

    private getSQLFetchContributionById() {
        let statement = `
        SELECT * FROM ${DB_TABLE.CONTRIBUTION_TABLE}
        WHERE ${CONTRIBUTION_COLUMNS.MEMBER_NUMBER} = $1
        AND ${CONTRIBUTION_COLUMNS.EMPLOYER_NUMBER} = $2
       `;
        return statement;
    }

    private getSQLFetchMultipleContribution() {
        let statement = `
        SELECT * FROM ${DB_TABLE.CONTRIBUTION_TABLE}
        LIMIT $1 OFFSET $2
       `;
        return statement;
    }

    private getSQLUpdateContribution(contributionDTO: ContributionDTO) {
        let updateColumn = '';
        let employerForeignKeyIdx = null;
        let memberForeignKeyIdx = null;

        Object.keys(contributionDTO).forEach((key, index) => {
            if (key === CONTRIBUTION_COLUMNS.EMPLOYER_NUMBER) {
                employerForeignKeyIdx = index + 1;
                return;
            } else if (key === CONTRIBUTION_COLUMNS.MEMBER_NUMBER) {
                memberForeignKeyIdx = index + 1;
                return;
            }

            if (updateColumn.length > 0) {
                updateColumn += ', ';
            }

            updateColumn += `${key} = `;
            updateColumn += `$${index + 1}`;
        });

        if (employerForeignKeyIdx === null || memberForeignKeyIdx === null) {
            throw new Error(`Failed to update contribution table. Unknown FK value`);
        }
        const sqlStatement = `
        UPDATE ${PG_SCHEMA}.${DB_TABLE.CONTRIBUTION_TABLE}
        SET ${updateColumn}
        WHERE ${CONTRIBUTION_COLUMNS.EMPLOYER_NUMBER} = $${employerForeignKeyIdx}
        AND ${CONTRIBUTION_COLUMNS.MEMBER_NUMBER} = $${employerForeignKeyIdx}
        `
        return sqlStatement;
    }

    private getSQLDeleteContribution() {
        `DELETE FROM contribution
WHERE 
    contribution_number = $1; -- Placeholder for contribution_number
`
    }



    public async create(contributionData?: ContributionFull) {
        const contributionDTO = buildContributionDTOFromData(contributionData);

        if (contributionDTO === null) {
            throw new Error(`CONTRIBUTION-DAO: Unable to create db values.`);
        }

        const query = this.getSQLCreateContribution(contributionDTO);
        const values = Object.values(contributionData);
        const result = await this.databaseService.executeStatement(query, values);
        return result;
    }

    // Get contributions with pagination
    public async findAll(limit: number, offset: number) {
        const query = this.getSQLFetchMultipleContribution();
        const result = await this.databaseService.executeStatement<ContributionDTO>(query, [limit, offset]);
        const contributionList: ContributionDTO[] | undefined = result.rows;
        if (contributionList === undefined || contributionList.length === 0) {
            return null;
        }

        const contributionDTO: ContributionDTO[] = contributionList;
        const response = contributionDTO.map(obj => {
            getCleanObject(obj);
            return buildContributionDataFromDTO(obj);
        });
        return response;
    }

    // Get a single contribution by contribution_number
    public async findById(contributionId: number) {
        const query = this.getSQLFetchContributionById();
        const result = await this.databaseService.executeStatement(query, [contributionId]);
        const contributionList: ContributionDTO[] | undefined = result.rows;
        if (contributionList === undefined || contributionList.length === 0) {
            return null;
        }

        const contributionDTO: ContributionDTO[] = contributionList;
        const response = contributionDTO.map(obj => {
            getCleanObject(obj);
            return buildContributionDataFromDTO(obj);
        });
        return response;
    }

    // Update a contribution
    public async update(contributionData?: ContributionFull): Promise<number> {
        const contributionDTO = buildContributionDTOFromData(contributionData);

        if (contributionDTO === null) {
            throw new Error(`CONTRIBUTION-DAO: Unable to create db values.`);
        }

        const query = this.getSQLUpdateContribution(contributionDTO);
        const values = Object.values(contributionData);
        const result = await this.databaseService.executeStatement(query, values);
        return result.rowCount;
    }

    // Delete a contribution
    public async delete(contributionId: number) {
        const query = `
            DELETE FROM contributions WHERE contribution_number = $1;
        `;
        const result = await this.databaseService.executeStatement(query, [contributionId]);
    }

}
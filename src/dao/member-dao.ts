import { PG_SCHEMA } from "../../config/constants";
import { MemberFull, MemberInitial } from "../model/api/member-api";
import { MEMBER_COLUMNS } from "../model/db/member-table";
import { DB_TABLE } from "../model/db/table";
import { buildMemberDataFromDTO, buildMemberDTOFromData, MemberDTO } from "../model/dto/member-dto";
import { DatabaseService } from "../service/database-service";
import { getCleanObject } from "../util/ts-utils";

export class MemberDao {

    private databaseService: DatabaseService;
    private static instance: MemberDao;

    constructor() {
        this.databaseService = DatabaseService.getInstance();
    }

    public static getInstance(): MemberDao {
        if (!MemberDao.instance) {
            MemberDao.instance = new MemberDao();
        }
        return MemberDao.instance;
    }

    private getSQLCreateMember(memberDTO: MemberDTO) {
        let insertColumn = '';
        let insertValue = '';

        Object.keys(memberDTO).forEach((key, index) => {
            if (insertColumn.length > 0) {
                insertColumn += ', ';
                insertValue += ', ';
            }

            insertColumn += `${key}`;
            insertValue += `$${index + 1}`;
        });

        const sqlStatement = `
        INSERT INTO ${PG_SCHEMA}.${DB_TABLE.MEMBER_TABLE} (
            ${insertColumn}
        ) VALUES (${insertValue})
        `
        return sqlStatement;
    }

    private getSQLFetchMemberById() {
        let statement = `
        SELECT * FROM ${DB_TABLE.MEMBER_TABLE}
        WHERE ${MEMBER_COLUMNS.MEMBER_NUMBER} = $1
       `;
        return statement;
    }

    private getSQLFetchMultipleMember() {
        let statement = `
        SELECT * FROM ${DB_TABLE.MEMBER_TABLE}
        LIMIT $1 OFFSET $2
       `;
        return statement;
    }

    private getSQLUpdateMember(memberDTO: MemberDTO) {
        let updateColumn = '';
        let primKeyIdx = null;

        Object.keys(memberDTO).forEach((key, index) => {
            if (key === MEMBER_COLUMNS.MEMBER_NUMBER) {
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
            throw new Error(`Failed to update member table. Unknown PK value`);
        }
        const sqlStatement = `
        UPDATE ${PG_SCHEMA}.${DB_TABLE.MEMBER_TABLE}
        SET ${updateColumn}
        WHERE ${MEMBER_COLUMNS.MEMBER_NUMBER} = $${primKeyIdx}
        `
        return sqlStatement;
    }

    private getSQLDeleteMember() {
        `DELETE FROM members
WHERE 
    member_number = $1; -- Placeholder for member_number
`
    }



    public async create(memberData?: MemberInitial) {
        const memberDTO = buildMemberDTOFromData(memberData);

        if (memberDTO === null) {
            throw new Error(`MEMBER-DAO: Unable to create db values.`);
        }

        const query = this.getSQLCreateMember(memberDTO);
        const values = Object.values(memberData);
        const result = await this.databaseService.executeStatement(query, values);
        return result;
    }

    // Get members with pagination
    public async findAll(limit: number, offset: number) {
        const query = this.getSQLFetchMultipleMember();
        const result = await this.databaseService.executeStatement<MemberDTO>(query, [limit, offset]);
        const memberList: MemberDTO[] | undefined = result.rows;
        if (memberList === undefined || memberList.length === 0) {
            return null;
        }

        const memberDTO: MemberDTO[] = memberList;
        const response = memberDTO.map(obj => {
            getCleanObject(obj);
            return buildMemberDataFromDTO(obj);
        });
        return response;
    }

    // Get a single member by member_number
    public async findById(memberId: number) {
        const query = this.getSQLFetchMemberById();
        const result = await this.databaseService.executeStatement(query, [memberId]);
        const memberList: MemberDTO[] | undefined = result.rows;
        if (memberList === undefined || memberList.length === 0) {
            return null;
        }

        const memberDTO: MemberDTO[] = memberList;
        const response = memberDTO.map(obj => {
            getCleanObject(obj);
            return buildMemberDataFromDTO(obj);
        });
        return response;
    }

    // Update a member
    public async update(memberData?: MemberFull): Promise<number> {
        const memberDTO = buildMemberDTOFromData(memberData);

        if (memberDTO === null) {
            throw new Error(`MEMBER-DAO: Unable to create db values.`);
        }

        const query = this.getSQLUpdateMember(memberDTO);
        const values = Object.values(memberData);
        const result = await this.databaseService.executeStatement(query, values);
        return result.rowCount;
    }

    // Delete a member
    public async delete(memberId: number) {
        const query = `
            DELETE FROM members WHERE member_number = $1;
        `;
        const result =  await this.databaseService.executeStatement(query, [memberId]);
    }

}
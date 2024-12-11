import { PG_SCHEMA } from "../../../config/constants";
import { ColumnBuilder, DatabaseTable, DB_DATA_TYPE, TableBuilder } from "../../util/database-utils";
import { EMPLOYER_COLUMNS } from "./employer-table";
import { MEMBER_COLUMNS } from "./member-table";
import { DB_TABLE } from "./table";

export enum CONTRIBUTION_COLUMNS {
    MONTH = "MONTH",
    MEMBER_NUMBER = "MEMBER_NUMBER",
    MEMBER_SHARE = "MEMBER_SHARE",
    EMPLOYER_NUMBER = "EMPLOYER_NUMBER",
    EMPLOYER_SHARE = "EMPLOYER_SHARE",
}


// month date NULL,
// member_number varchar(12) NULL,
// member_share money NULL,
// employer_number varchar(12) NULL,
// employer_share money NULL


export class ContributionTable extends DatabaseTable<CONTRIBUTION_COLUMNS> {
    private static instance: ContributionTable;

    private constructor() {
        super();
        this.initializeTable();
    }

    public static getInstance(): ContributionTable {
        if (!ContributionTable.instance) {
            ContributionTable.instance = new ContributionTable();
        }
        return ContributionTable.instance;
    }

    readonly columnsMap: Map<CONTRIBUTION_COLUMNS, ColumnBuilder<CONTRIBUTION_COLUMNS>> = new Map([
        [
            CONTRIBUTION_COLUMNS.EMPLOYER_NUMBER,
            new ColumnBuilder(CONTRIBUTION_COLUMNS.EMPLOYER_NUMBER, DB_DATA_TYPE.INT4)
                .setAsAutoGenerate()
            // .setNotNullable()
        ],
        [
            CONTRIBUTION_COLUMNS.EMPLOYER_SHARE,
            new ColumnBuilder(CONTRIBUTION_COLUMNS.EMPLOYER_SHARE, DB_DATA_TYPE.MONEY)
        ],
        [
            CONTRIBUTION_COLUMNS.MEMBER_NUMBER,
            new ColumnBuilder(CONTRIBUTION_COLUMNS.MEMBER_NUMBER, DB_DATA_TYPE.INT4)
        ],
        [
            CONTRIBUTION_COLUMNS.MEMBER_SHARE,
            new ColumnBuilder(CONTRIBUTION_COLUMNS.MEMBER_SHARE, DB_DATA_TYPE.MONEY)
        ],
        [
            CONTRIBUTION_COLUMNS.MONTH,
            new ColumnBuilder(CONTRIBUTION_COLUMNS.MONTH, DB_DATA_TYPE.DATE)
        ],
    ]);

    private parentMemberFkConstraint: string = `CONSTRAINT ${DB_TABLE.CONTRIBUTION_TABLE}_${CONTRIBUTION_COLUMNS.EMPLOYER_NUMBER}_FK FOREIGN KEY (${CONTRIBUTION_COLUMNS.EMPLOYER_NUMBER}) REFERENCES ${PG_SCHEMA}.${DB_TABLE.EMPLOYER_TABLE}(${EMPLOYER_COLUMNS.EMPLOYER_NUMBER}) ON DELETE CASCADE`;
    private employerNumberFkConstraint: string = `CONSTRAINT ${DB_TABLE.CONTRIBUTION_TABLE}_${CONTRIBUTION_COLUMNS.MEMBER_NUMBER}_FK FOREIGN KEY (${CONTRIBUTION_COLUMNS.MEMBER_NUMBER}) REFERENCES ${PG_SCHEMA}.${DB_TABLE.MEMBER_TABLE}(${MEMBER_COLUMNS.MEMBER_NUMBER}) ON DELETE CASCADE`;

    readonly tableInfo: TableBuilder<CONTRIBUTION_COLUMNS> = new TableBuilder<CONTRIBUTION_COLUMNS>(PG_SCHEMA as string, DB_TABLE.CONTRIBUTION_TABLE, Array.from(this.columnsMap.values()));

    protected initializeTable() {
        this.tableInfo.addConstraints([
            this.parentMemberFkConstraint,
            this.employerNumberFkConstraint,
        ]);
    }

    getSQLCreation(): string {
        try {
            return super.getSQLCreation();
        } catch (error) {
            console.error(`Fail to generate Employer Table SQL`);
            throw error;
        }
    }
}
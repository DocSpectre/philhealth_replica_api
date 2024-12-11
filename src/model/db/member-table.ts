import { PG_SCHEMA } from "../../../config/constants";
import { ColumnBuilder, DatabaseTable, DB_DATA_TYPE, TableBuilder } from "../../util/database-utils";
import { EMPLOYER_COLUMNS } from "./employer-table";
import { DB_TABLE } from "./table";

export enum MEMBER_COLUMNS {
    MEMBER_NUMBER = "member_number",
    EMPLOYER_NUMBER = "employer_number",
    LAST_NAME = "last_name",
    FIRST_NAME = "first_name",
    DATE_OF_BIRTH = "date_of_birth",
    EMAIL_ADDRESS = "email_address",
    TELEPHONE_NUMBER = "telephone_number",
    PERMANENT_ADDRESS = "permanent_address"
}



export class MemberTable extends DatabaseTable<MEMBER_COLUMNS> {
    private static instance: MemberTable;

    private constructor() {
        super();
        this.initializeTable();
    }


    public static getInstance(): MemberTable {
        if (!MemberTable.instance) {
            MemberTable.instance = new MemberTable();
        }
        return MemberTable.instance;
    }

    // member_number varchar(12) NOT NULL,
    // employer_number varchar(12) NULL,
    // last_name varchar(50) NULL,
    // first_name varchar(50) NULL,
    // date_of_birth date NULL,
    // email_address varchar(100) NULL,
    // telephone_number varchar(11) NULL,
    // permanent_address varchar NULL,

    readonly columnsMap: Map<MEMBER_COLUMNS, ColumnBuilder<MEMBER_COLUMNS>> = new Map([
        [
            MEMBER_COLUMNS.MEMBER_NUMBER,
            new ColumnBuilder(MEMBER_COLUMNS.MEMBER_NUMBER, DB_DATA_TYPE.INT4)
                .setAsPrimaryKey()
                .setDefaultValue('GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE)')
                .setNotNullable()
        ],
        [
            MEMBER_COLUMNS.EMPLOYER_NUMBER,
            new ColumnBuilder(MEMBER_COLUMNS.EMPLOYER_NUMBER, DB_DATA_TYPE.INT4)
        ],
        [
            MEMBER_COLUMNS.LAST_NAME,
            new ColumnBuilder(MEMBER_COLUMNS.LAST_NAME, DB_DATA_TYPE.VARCHAR, 50)
        ],
        [
            MEMBER_COLUMNS.FIRST_NAME,
            new ColumnBuilder(MEMBER_COLUMNS.FIRST_NAME, DB_DATA_TYPE.VARCHAR, 50)
        ],
        [
            MEMBER_COLUMNS.DATE_OF_BIRTH,
            new ColumnBuilder(MEMBER_COLUMNS.DATE_OF_BIRTH, DB_DATA_TYPE.DATE)
        ],
        [
            MEMBER_COLUMNS.EMAIL_ADDRESS,
            new ColumnBuilder(MEMBER_COLUMNS.EMAIL_ADDRESS, DB_DATA_TYPE.VARCHAR, 100)
        ],
        [
            MEMBER_COLUMNS.TELEPHONE_NUMBER,
            new ColumnBuilder(MEMBER_COLUMNS.TELEPHONE_NUMBER, DB_DATA_TYPE.VARCHAR, 11)
        ],
        [
            MEMBER_COLUMNS.PERMANENT_ADDRESS,
            new ColumnBuilder(MEMBER_COLUMNS.PERMANENT_ADDRESS, DB_DATA_TYPE.VARCHAR)
        ],
    ]);

    private employerFkConstraint: string = `CONSTRAINT ${DB_TABLE.MEMBER_TABLE}_${MEMBER_COLUMNS.EMPLOYER_NUMBER}_FK FOREIGN KEY (${EMPLOYER_COLUMNS.EMPLOYER_NUMBER}) REFERENCES ${PG_SCHEMA}.${DB_TABLE.EMPLOYER_TABLE}(${MEMBER_COLUMNS.EMPLOYER_NUMBER}) ON DELETE SET NULL`;

    readonly tableInfo: TableBuilder<MEMBER_COLUMNS> = new TableBuilder<MEMBER_COLUMNS>(PG_SCHEMA as string, DB_TABLE.MEMBER_TABLE, Array.from(this.columnsMap.values()));

    protected initializeTable(): void {
        this.tableInfo
            .addConstraints([
                this.employerFkConstraint,
            ])
    }

    getSQLCreation(): string {
        try {
            return super.getSQLCreation();
        } catch (error) {
            console.error(`Fail to generate Member Table SQL`);
            throw error;
        }
    }
}
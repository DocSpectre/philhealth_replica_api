import { PG_SCHEMA } from "../../../config/constants";
import { ColumnBuilder, DatabaseTable, DB_DATA_TYPE, TableBuilder } from "../../util/database-utils";
import { MEMBER_COLUMNS } from "./member-table";
import { DB_TABLE } from "./table";

export enum DEPENDENT_COLUMNS {
    DEPENDENT_ID = "DEPENDENT_ID",
    PARENT_MEMBER_NUMBER = "PARENT_MEMBER_NUMBER",
    LAST_NAME = "LAST_NAME",
    FIRST_NAME = "FIRST_NAME",
    DATE_OF_BIRTH = "DATE_OF_BIRTH",
}


// dependent_id int4 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE) NOT NULL,
// parent_member_number varchar(12) NULL,
// last_name varchar(50) NULL,
// first_name varchar(50) NULL,
// date_of_birth date NULL


export class DependentTable extends DatabaseTable<DEPENDENT_COLUMNS> {
    private static instance: DependentTable;

    private constructor() {
        super();
        this.initializeTable();
    }

    public static getInstance(): DependentTable {
        if (!DependentTable.instance) {
            DependentTable.instance = new DependentTable();
        }
        return DependentTable.instance;
    }

    readonly columnsMap: Map<DEPENDENT_COLUMNS, ColumnBuilder<DEPENDENT_COLUMNS>> = new Map([
        [
            DEPENDENT_COLUMNS.DEPENDENT_ID,
            new ColumnBuilder(DEPENDENT_COLUMNS.DEPENDENT_ID, DB_DATA_TYPE.INT4)
                // .setAsAutoGenerate()
                .setAsPrimaryKey()
                .setDefaultValue('GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE)')
                .setNotNullable()
        ],
        [
            DEPENDENT_COLUMNS.PARENT_MEMBER_NUMBER,
            new ColumnBuilder(DEPENDENT_COLUMNS.PARENT_MEMBER_NUMBER, DB_DATA_TYPE.INT4)
        ],
        [
            DEPENDENT_COLUMNS.FIRST_NAME,
            new ColumnBuilder(DEPENDENT_COLUMNS.FIRST_NAME, DB_DATA_TYPE.VARCHAR, 50)
        ],
        [
            DEPENDENT_COLUMNS.LAST_NAME,
            new ColumnBuilder(DEPENDENT_COLUMNS.LAST_NAME, DB_DATA_TYPE.VARCHAR, 50)
        ],
        [
            DEPENDENT_COLUMNS.DATE_OF_BIRTH,
            new ColumnBuilder(DEPENDENT_COLUMNS.DATE_OF_BIRTH, DB_DATA_TYPE.DATE)
        ],
    ]);

    private parentMemberFkConstraint: string = `CONSTRAINT ${DB_TABLE.DEPENDENT_TABLE}_${DEPENDENT_COLUMNS.PARENT_MEMBER_NUMBER}_FK FOREIGN KEY (${DEPENDENT_COLUMNS.PARENT_MEMBER_NUMBER}) REFERENCES ${PG_SCHEMA}.${DB_TABLE.MEMBER_TABLE}(${MEMBER_COLUMNS.MEMBER_NUMBER}) ON DELETE CASCADE`;

    readonly tableInfo: TableBuilder<DEPENDENT_COLUMNS> = new TableBuilder<DEPENDENT_COLUMNS>(PG_SCHEMA as string, DB_TABLE.DEPENDENT_TABLE, Array.from(this.columnsMap.values()));

    protected initializeTable() {
        this.tableInfo.addConstraints([
            this.parentMemberFkConstraint,
        ])
    }

    getSQLCreation(): string {
        try {
            return super.getSQLCreation();
        } catch (error) {
            console.error(`Fail to generate Dependent Table SQL`);
            throw error;
        }
    }
}
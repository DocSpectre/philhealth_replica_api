import { PG_SCHEMA } from "../../../config/constants";
import { ColumnBuilder, DatabaseTable, DB_DATA_TYPE, TableBuilder } from "../../util/database-utils";
import { DB_TABLE } from "./table";

export enum EMPLOYER_COLUMNS {
    EMPLOYER_NUMBER = "EMPLOYER_NUMBER",
    EMPLOYER_NAME = "EMPLOYER_NAME",
    ADDRESS = "ADDRESS",
}


// employer_number varchar(12) NOT NULL,
// employer_name varchar(100) NULL,
// address varchar NULL,
// CONSTRAINT employer_pkey PRIMARY KEY (employer_number)


export class EmployerTable extends DatabaseTable<EMPLOYER_COLUMNS> {
    private static instance: EmployerTable;

    private constructor() {
        super();
        this.initializeTable();
    }

    public static getInstance(): EmployerTable {
        if (!EmployerTable.instance) {
            EmployerTable.instance = new EmployerTable();
        }
        return EmployerTable.instance;
    }

    readonly columnsMap: Map<EMPLOYER_COLUMNS, ColumnBuilder<EMPLOYER_COLUMNS>> = new Map([
        [
            EMPLOYER_COLUMNS.EMPLOYER_NUMBER,
            new ColumnBuilder(EMPLOYER_COLUMNS.EMPLOYER_NUMBER, DB_DATA_TYPE.INT4)
                .setAsPrimaryKey()
                .setDefaultValue('GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE)')
                .setNotNullable()
        ],
        [
            EMPLOYER_COLUMNS.EMPLOYER_NAME,
            new ColumnBuilder(EMPLOYER_COLUMNS.EMPLOYER_NAME, DB_DATA_TYPE.VARCHAR, 100)
        ],
        [
            EMPLOYER_COLUMNS.ADDRESS,
            new ColumnBuilder(EMPLOYER_COLUMNS.ADDRESS, DB_DATA_TYPE.VARCHAR)
        ]
    ]);


    readonly tableInfo: TableBuilder<EMPLOYER_COLUMNS> = new TableBuilder<EMPLOYER_COLUMNS>(PG_SCHEMA as string, DB_TABLE.EMPLOYER_TABLE, Array.from(this.columnsMap.values()));

    protected initializeTable() {
        this.tableInfo
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
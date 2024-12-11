import { DB_TABLE } from "../model/db/table";

export enum DB_DATA_TYPE {
    INTEGER = "INTEGER",
    VARCHAR = "VARCHAR",
    CHAR = "CHAR",
    TEXT = "TEXT",
    DATE = "DATE",
    BIGINT = "BIGINT",
    INT4 = "INT4",
    MONEY = "MONEY",
}

export interface ColumnBuilderSQLOptions {
    withColumnName?: boolean;
    withDataType?: boolean;
    withAutoGenerate?: boolean;
    withDefaultVal?: boolean;
    withNullable?: boolean;
    escapeDefaultVal?: boolean;
}

export abstract class DatabaseTable<T> {
    readonly columnsMap: Map<T, ColumnBuilder<T>>;
    readonly tableInfo: TableBuilder<T>;
    protected abstract initializeTable(): void;

    getSQLCreation(): string {
        return this.tableInfo.getCreateTableSQL();
    }
}


export class ColumnBuilder<T> {
    columnName: T;
    dataType: DB_DATA_TYPE;
    dataTypeSize?: number;
    dataTypeDetails?: string;
    isNullable: boolean;
    isPrimaryKey: boolean;
    isAutoGenerate: boolean;
    defaultValue?: string;
    hasDefaultKeyword?: boolean;

    constructor(columnName: T, dataType: DB_DATA_TYPE, dataTypeSize?: number) {
        this.columnName = columnName;
        this.dataType = dataType;
        this.dataTypeSize = dataTypeSize;
        this.isNullable = true;
        this.isPrimaryKey = false;
        this.isAutoGenerate = false;
    }


    setAsPrimaryKey(): ColumnBuilder<T> {
        this.isPrimaryKey = true;
        return this;
    }

    setNotNullable(): ColumnBuilder<T> {
        this.isNullable = false;
        return this;
    }

    setAsAutoGenerate(): ColumnBuilder<T> {
        this.isAutoGenerate = true;
        return this;
    }

    setDefaultValue(defaultValue: string, hasDefaultKeyword: boolean = false): ColumnBuilder<T> {
        this.defaultValue = defaultValue;
        this.hasDefaultKeyword = hasDefaultKeyword;
        return this;
    }

    setDataTypeDetails(dataTypeDetails: string): ColumnBuilder<T> {
        this.dataTypeDetails = dataTypeDetails;
        return this;
    }

    getCreateColumnSql(option?: ColumnBuilderSQLOptions): string {
        const dataType = ` ${getDBDataTypeWithSize(this.dataType, this.dataTypeSize)}`;
        const dataTypeDetails = this.dataTypeDetails ? `${dataType} ${this.dataTypeDetails}` : dataType;
        const autoGen = this.isAutoGenerate ? ` ` : ''; //
        let hasEscapeDefaultValue = false;
        if (option !== undefined && option.escapeDefaultVal !== undefined && option.escapeDefaultVal) {
            hasEscapeDefaultValue = true;
        }

        const defaultValueEscape = hasEscapeDefaultValue ? `'${this.defaultValue}'` : `${this.defaultValue}`;
        const defaultValue = this.defaultValue ? ` ${this.hasDefaultKeyword ? `DEFAULT ` : ''}${defaultValueEscape}` : '';
        const nullable = this.isNullable ? '' : ' NOT NULL';

        let sql = ``;
        // if (option === undefined || option.withColumnName === undefined
        //     || (option !== undefined && option.withColumnName !== undefined && option.withColumnName)) {
        //     sql += `${this.columnName}`
        // }

        // if (option === undefined || option.withDataType === undefined
        //     || (option !== undefined && option.withDataType !== undefined && option.withDataType)) {
        //     sql += `${this.dataTypeDetails}`;
        // }

        sql = appendIfOptionEnabled(sql, option, 'withColumnName', this.columnName);
        sql = appendIfOptionEnabled(sql, option, 'withDataType', dataTypeDetails);
        sql = appendIfOptionEnabled(sql, option, 'withAutoGenerate', autoGen);
        sql = appendIfOptionEnabled(sql, option, 'withDefaultVal', defaultValue);
        sql = appendIfOptionEnabled(sql, option, 'withNullable', nullable);

        function appendIfOptionEnabled<K extends keyof ColumnBuilderSQLOptions>(
            sql: string,
            option: ColumnBuilderSQLOptions,
            key: K,
            value
        ) {
            if (
                option === undefined ||
                option[key] === undefined ||
                option[key]
            ) {
                sql += value;
            }
            return sql;
        }

        return sql
    }
}

export function getDBDataTypeWithSize(dbDataType: DB_DATA_TYPE, size?: number): string {
    let str = `${dbDataType}`;
    if (size !== undefined) {
        str += `(${size})`;
    }
    return str;
}

export class TableBuilder<T> {
    schema: string;
    tableName: DB_TABLE;
    columns: ColumnBuilder<T>[];
    indexes?: string[];
    constraints?: string[];
    triggers?: string[];
    alterTableScripts?: string[];
    primaryKeyName?: string;


    constructor(schema: string, tableName: DB_TABLE, columns: ColumnBuilder<T>[], addPrimaryKeyConstraint: boolean = true) {
        this.schema = schema;
        this.tableName = tableName;
        this.columns = columns;
        if (addPrimaryKeyConstraint) {
            this.addPKConstraint();
        }
    }

    private addPKConstraint(): void {
        let hasPrimaryKeys = false;
        hasPrimaryKeys = this.columns.some(column => column.isPrimaryKey);
        if (hasPrimaryKeys) {
            const pkName = `${this.primaryKeyName !== undefined ? this.primaryKeyName : `${this.tableName}_PK`}`;
            this.constraints = [
                `CONSTRAINT ${pkName} PRIMARY KEY (${this.getPrimaryKeys()})`
            ];
        }
    }

    private getPrimaryKeys(): string {
        let primaryKeys = '';
        this.columns.forEach(column => {
            if (column.isPrimaryKey) {
                if (primaryKeys !== '') {
                    primaryKeys += ',';
                }
                primaryKeys += `${column.columnName}`;
            }
        });
        return primaryKeys;
    }

    addIndexes(indexes: string[]) {
        if (this.indexes === undefined) {
            this.indexes = [];
        }

        this.indexes = [...this.indexes, ...indexes];
        return this;
    }

    addConstraints(constraints: string[]) {
        if (this.constraints === undefined) {
            this.constraints = [];
        }
        this.constraints = [...this.constraints, ...constraints];
        return this;
    }

    addTriggers(triggers: string[]) {
        if (this.triggers === undefined) {
            this.triggers = [];
        }
        this.triggers = [...this.triggers, ...triggers];
        return this;
    }

    addAlterTableScripts(alterTableScripts: string[]) {
        if (this.alterTableScripts === undefined) {
            this.alterTableScripts = [];
        }
        this.alterTableScripts = [...this.alterTableScripts, ...alterTableScripts];
        return this;
    }

    getCreateTableSQL(): string {
        let columnSQL = '';

        this.columns.forEach((col: ColumnBuilder<T>, i: number) => {
            // format identation
            if (i > 0 && i < this.columns.length) {
                columnSQL += `
        `;
            }

            columnSQL += `${col.getCreateColumnSql()}`;
            if (i + 1 < this.columns.length) {
                columnSQL += `,`;
            }
        });

        let constraints = '';
        if (this.constraints) {
            const constraintsLength = this.constraints.length;
            this.constraints.forEach((constraintsStr: string, i: number) => {
                constraints += `${constraintsStr}`;

                // format with line break and identation
                if (i + 1 < constraintsLength) {
                    constraints += `,
        `;
                }
            });
        }

        let middleSQL = `${columnSQL}`;
        if (constraints !== '') {
            middleSQL += `,
        ${constraints}`;
        }

        return `CREATE TABLE ${this.getSchemaTableName()} (
        ${middleSQL}
)`;
    }

    getSchemaTableName(): string {
        return `${this.schema !== undefined && this.schema !== null && this.schema.trim().length > 0 ? `${this.schema}.` : ''}${this.tableName}`;
    }
}
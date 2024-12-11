export interface EmployerBase {
    employer_name: string;
    address: string;
}

export interface EmployerId {
    employer_number: string;
}

export interface EmployerFull extends EmployerBase, EmployerId {
}
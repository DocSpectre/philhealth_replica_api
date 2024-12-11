import { nameOf } from "../../util/ts-utils";
import { EmployerFull } from "../api/employer-api";
import { EMPLOYER_COLUMNS } from "../db/employer-table";


export interface EmployerDTO extends Partial<Record<EMPLOYER_COLUMNS, string | number>> {
};

export function buildEmployerDTOFromData(employerData: EmployerFull): EmployerDTO | null {
    let employerDTO: Partial<EmployerDTO> = {};

    Object.keys(employerData).forEach(key => {
        switch (key) {
            case nameOf<EmployerFull>('address'): {
                employerDTO.ADDRESS = employerData.address;
                break;
            }
            case nameOf<EmployerFull>('employer_name'): {
                employerDTO.EMPLOYER_NAME = employerData.employer_name;
                break;
            }
            case nameOf<EmployerFull>('employer_number'): {
                employerDTO.EMPLOYER_NUMBER = employerData.employer_number;
                break;
            }
            default:
                console.warn(`Attribute from Employer api not mapped. Attribute: ${key}`);
        }
    });

    return employerDTO;
}


export function buildEmployerDataFromDTO(employerDTO: EmployerDTO) {
    let employerData: Partial<EmployerFull> = {};

    Object.keys(employerDTO).forEach(key => {
        switch (key) {
            case EMPLOYER_COLUMNS.ADDRESS: {
                employerData.address = employerDTO.ADDRESS as string;
                break;
            }
            case EMPLOYER_COLUMNS.EMPLOYER_NAME: {
                employerData.employer_name = employerDTO.EMPLOYER_NAME as string;
                break;
            }
            case EMPLOYER_COLUMNS.EMPLOYER_NUMBER: {
                employerData.employer_number = employerDTO.EMPLOYER_NUMBER as string;
                break;
            }
            default:
                console.warn(`Attribute from Employer api not mapped. Attribute: ${key}`);
        }
    });

    return employerData;
}
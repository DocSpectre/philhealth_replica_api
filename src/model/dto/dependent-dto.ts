import { nameOf } from "../../util/ts-utils";
import { DependentFull } from "../api/dependent-api";
import { DEPENDENT_COLUMNS } from "../db/dependent-table";


export interface DependentDTO extends Partial<Record<DEPENDENT_COLUMNS, string | number>> {
};

export function buildDependentDTOFromData(dependentData: DependentFull): DependentDTO | null {
    let dependentDTO: Partial<DependentDTO> = {};

    Object.keys(dependentData).forEach(key => {
        switch (key) {
            case nameOf<DependentFull>('birthday'): {
                dependentDTO.DATE_OF_BIRTH = dependentData.birthday;
                break;
            }
            case nameOf<DependentFull>('dependent_id'): {
                dependentDTO.DEPENDENT_ID = dependentData.dependent_id;
                break;
            }
            case nameOf<DependentFull>('first_name'): {
                dependentDTO.FIRST_NAME = dependentData.first_name;
                break;
            }
            case nameOf<DependentFull>('last_name'): {
                dependentDTO.LAST_NAME = dependentData.last_name;
                break;
            }
            default:
                console.warn(`Attribute from Dependent api not mapped. Attribute: ${key}`);
        }
    });

    return dependentDTO;
}


export function buildDependentDataFromDTO(dependentDTO: DependentDTO) {
    let dependentData: Partial<DependentFull> = {};

    Object.keys(dependentDTO).forEach(key => {
        switch (key) {
            case DEPENDENT_COLUMNS.DATE_OF_BIRTH: {
                dependentData.birthday = dependentDTO.DATE_OF_BIRTH as string;
                break;
            }
            case DEPENDENT_COLUMNS.DEPENDENT_ID: {
                dependentData.dependent_id = dependentDTO.DEPENDENT_ID as string;
                break;
            }
            case DEPENDENT_COLUMNS.FIRST_NAME: {
                dependentData.first_name = dependentDTO.FIRST_NAME as string;
                break;
            }
            case DEPENDENT_COLUMNS.LAST_NAME: {
                dependentData.last_name = dependentDTO.LAST_NAME as string;
                break;
            }
            default:
                console.warn(`Attribute from Dependent api not mapped. Attribute: ${key}`);
        }
    });

    return dependentData;
}
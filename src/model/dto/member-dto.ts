import { nameOf } from "../../util/ts-utils";
import { MemberFull } from "../api/member-api";
import { MEMBER_COLUMNS } from "../db/member-table";


export interface MemberDTO extends Partial<Record<MEMBER_COLUMNS, string | number>> {
};

export function buildMemberDTOFromData(memberData: MemberFull): MemberDTO | null {
    let memberDTO: Partial<MemberDTO> = {};

    Object.keys(memberData).forEach(key => {
        switch (key) {
            case nameOf<MemberFull>('id'): {
                memberDTO.member_number = memberData.id;
                break;
            }
            case nameOf<MemberFull>('birthday'): {
                memberDTO.date_of_birth = memberData.birthday;
                break;
            }
            case nameOf<MemberFull>('email'): {
                memberDTO.email_address = memberData.email;
                break;
            }
            case nameOf<MemberFull>('employer_number'): {
                memberDTO.employer_number = memberData.employer_number;
                break;
            }
            case nameOf<MemberFull>('first_name'): {
                memberDTO.first_name = memberData.first_name;
                break;
            }
            case nameOf<MemberFull>('last_name'): {
                memberDTO.last_name = memberData.last_name;
                break;
            }
            case nameOf<MemberFull>('permanent_address'): {
                memberDTO.permanent_address = memberData.permanent_address;
                break;
            }
            case nameOf<MemberFull>('phone_number'): {
                memberDTO.telephone_number = memberData.phone_number;
                break;
            }
            default:
                console.warn(`Attribute from Member api not mapped. Attribute: ${key}`);
        }
    });

    return memberDTO;
}


export function buildMemberDataFromDTO(memberDTO: MemberDTO) {
    let memberData: Partial<MemberFull> = {};

    Object.keys(memberDTO).forEach(key => {
        switch (key) {
            case MEMBER_COLUMNS.MEMBER_NUMBER: {
                memberData.id = memberDTO.member_number as number;
                break;
            }
            case MEMBER_COLUMNS.DATE_OF_BIRTH: {
                memberData.birthday = memberDTO.date_of_birth as string;
                break;
            }
            case MEMBER_COLUMNS.EMAIL_ADDRESS: {
                memberData.email = memberDTO.email_address as string;
                break;
            }
            case MEMBER_COLUMNS.EMPLOYER_NUMBER: {
                memberData.employer_number = memberDTO.employer_number as string;
                break;
            }
            case MEMBER_COLUMNS.FIRST_NAME: {
                memberData.first_name = memberDTO.first_name as string;
                break;
            }
            case MEMBER_COLUMNS.LAST_NAME: {
                memberData.last_name = memberDTO.last_name as string;
                break;
            }
            case MEMBER_COLUMNS.PERMANENT_ADDRESS: {
                memberData.permanent_address = memberDTO.permanent_address as string;
                break;
            }
            case MEMBER_COLUMNS.TELEPHONE_NUMBER: {
                memberData.phone_number = memberDTO.telephone_number as string;
                break;
            }
            default:
                console.warn(`Attribute from Member api not mapped. Attribute: ${key}`);
        }
    });

    return memberData;
}
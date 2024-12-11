import { nameOf } from "../../util/ts-utils";
import { ContributionFull } from "../api/contribution-api";
import { CONTRIBUTION_COLUMNS } from "../db/contribution-table";


export interface ContributionDTO extends Partial<Record<CONTRIBUTION_COLUMNS, string>> {
};

export function buildContributionDTOFromData(contributionData: ContributionFull): ContributionDTO | null {
    let contributionDTO: Partial<ContributionDTO> = {};

    Object.keys(contributionData).forEach(key => {
        switch (key) {
            case nameOf<ContributionFull>('employer_number'): {
                contributionDTO.MEMBER_NUMBER = contributionData.employer_number;
                break;
            }
            case nameOf<ContributionFull>('employer_share'): {
                contributionDTO.EMPLOYER_SHARE = contributionData.employer_share;
                break;
            }
            case nameOf<ContributionFull>('member_share'): {
                contributionDTO.MEMBER_SHARE = contributionData.member_share;
                break;
            }
            case nameOf<ContributionFull>('month'): {
                contributionDTO.MONTH = contributionData.month;
                break;
            }
            default:
                console.warn(`Attribute from Contribution api not mapped. Attribute: ${key}`);
        }
    });

    return contributionDTO;
}


export function buildContributionDataFromDTO(memberDTO: ContributionDTO) {
    let contributionData: Partial<ContributionFull> = {};

    Object.keys(memberDTO).forEach(key => {
        switch (key) {
            case CONTRIBUTION_COLUMNS.EMPLOYER_NUMBER: {
                contributionData.employer_number = memberDTO.EMPLOYER_NUMBER as string;
                break;
            }
            case CONTRIBUTION_COLUMNS.EMPLOYER_SHARE: {
                contributionData.employer_share = memberDTO.EMPLOYER_SHARE as string;
                break;
            }
            case CONTRIBUTION_COLUMNS.MEMBER_NUMBER: {
                contributionData.member_share = memberDTO.MEMBER_SHARE as string;
                break;
            }
            case CONTRIBUTION_COLUMNS.EMPLOYER_NUMBER: {
                contributionData.month = memberDTO.MONTH as string;
                break;
            }
            default:
                console.warn(`Attribute from Contribution api not mapped. Attribute: ${key}`);
        }
    });

    return contributionData;
}
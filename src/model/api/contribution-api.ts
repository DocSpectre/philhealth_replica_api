export interface ContributionBase {
    month: string;
    member_share: string;
    employer_share: string;
}

export interface ContributionId {
    employer_number: string;
}

export interface ContributionFull extends ContributionBase, ContributionId {
}
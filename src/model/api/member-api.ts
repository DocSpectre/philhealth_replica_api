export interface MemberBase {
    last_name: string;
    first_name: string;
    birthday: string;
}

export interface MemberId {
    id: number;
}

export interface MemberOptionals {
    employer_number?: string;
    email?: string;
    phone_number?: string;
    permanent_address?: string;
}

export interface MemberInitial extends MemberBase, MemberId, MemberOptionals {
}

export interface MemberFull extends MemberInitial, MemberOptionals {
}
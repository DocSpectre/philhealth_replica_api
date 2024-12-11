export interface DependentBase {
    last_name: string;
    first_name: string;
    birthday: string;
}

export interface DependentId {
    dependent_id: string;
}

export interface DependentFull extends DependentBase, DependentId {
}
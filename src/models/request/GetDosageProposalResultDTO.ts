export interface GetDosageProposalResultDTO {
    type: string;
    iteration: string;
    mapping: string;
    unitTextSingular: string;
    unitTextPlural: string;
    supplementaryText: string;
    beginDates: string[];
    endDates: string[];
    fmkversion: string;
    dosageProposalVersion: number;
    shortTextMaxLength: number;
}

import { type DateFormattedString } from "./DateFormattedString.js";

export interface GetDosageProposalResultDTO {
    type: string;
    iteration: string;
    mapping: string;
    unitTextSingular: string;
    unitTextPlural: string;
    supplementaryText?: string;
    beginDates: DateFormattedString[];
    /**
     * @format date
     */
    endDates?: (DateFormattedString | null)[];
    fmkversion: string;
    /**
     * @isInt 
     */
    dosageProposalVersion: number;
    /**
     * @isInt 
     */
    shortTextMaxLength?: number;
}



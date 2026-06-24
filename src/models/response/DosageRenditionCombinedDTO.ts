
export interface DosageRenditionCombinedDTO {
    CombinedTranslation: CombinedTranslation;
    PeriodTranslations: CombinedTranslation[];
}

export interface CombinedTranslation {
    ShortText: string;
    LongText: string;
}
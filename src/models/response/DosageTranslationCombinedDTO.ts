import {DosageTranslationDTO} from './DosageTranslationDTO.js';

export class DosageTranslationCombinedDTO {
    combinedTranslation: DosageTranslationDTO;
    periodTranslations: DosageTranslationDTO[];

    constructor(combinedTranslation: DosageTranslationDTO, periodTranslations: DosageTranslationDTO[]) {
        this.combinedTranslation = combinedTranslation;
        this.periodTranslations = periodTranslations;
    }

    public getCombinedTranslation(): DosageTranslationDTO {
        return this.combinedTranslation;
    }

    public getPeriodTranslations(): DosageTranslationDTO[] {
        return this.periodTranslations;
    }
}

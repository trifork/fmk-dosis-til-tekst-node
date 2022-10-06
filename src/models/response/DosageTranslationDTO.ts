import {DailyDosis} from 'fmk-dosis-til-tekst-ts-commonjs/dist/lib/DailyDosis';

export class DosageTranslationDTO {
    shortText: string;
    longText: string;
    dailyDosis: DailyDosis;

    constructor(shortText: string, longText: string, dailyDosis: DailyDosis) {
        this.shortText = shortText;
        this.longText = longText;
        this.dailyDosis = dailyDosis;
    }

    public getShortText(): string {
        return this.shortText;
    }

    public getLongText(): string {
        return this.longText;
    }

    public getDailyDosis(): DailyDosis {
        return this.dailyDosis;
    }
}

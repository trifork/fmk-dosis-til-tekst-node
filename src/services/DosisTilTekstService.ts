import {
    CombinedTextConverter,
    DailyDosis,
    DailyDosisCalculator,
    DosageProposalXML,
    DosageProposalXMLGenerator,
    DosageType,
    DosageTypeCalculator,
    DosageTypeCalculator144,
    Factory,
    TextHelper,
    TextOptions
} from 'fmk-dosis-til-tekst-ts';
import { GetDosageProposalResultDTO } from '../models/request/GetDosageProposalResultDTO';
import { DosageWrapperWithOptionsDTO } from '../models/request/DosageWrapperWithOptionsDTO';
import { DosageWrapperWithOptionsAndMaxLengthDTO } from '../models/request/DosageWrapperWithOptionsAndMaxLengthDTO';
import { DosageWrapperWithMaxLengthDTO } from '../models/request/DosageWrapperWithMaxLengthDTO';
import { DosageWrapperDTO } from '../models/request/DosageWrapperDTO';
import { DosageTranslationDTO } from '../models/response/DosageTranslationDTO';
import { DosageTranslationCombinedDTO } from '../models/response/DosageTranslationCombinedDTO';
import { logger } from '../logger/logger';


export class DosisTilTekstService {
    public health() {
        return { "status": "OK" };
    }

    public getDosageProposalResult(requestDTO: GetDosageProposalResultDTO): DosageProposalXML {
        let beginDateArray = [];
        let endDateArray = [];

        for (let i = 0; i < requestDTO.beginDates.length; i++) {
            let beginDateJS = new Date(requestDTO.beginDates[i]);
            beginDateArray.push(beginDateJS);

            let endDateJS: any = null;
            if (requestDTO.endDates && requestDTO.endDates[i]) {
                endDateJS = new Date(requestDTO.endDates[i]!);
            }

            endDateArray.push(endDateJS);
        }

        if (requestDTO.shortTextMaxLength === undefined) {
            return DosageProposalXMLGenerator.generateXMLSnippet(requestDTO.type, requestDTO.iteration,
                requestDTO.mapping, requestDTO.unitTextSingular, requestDTO.unitTextPlural,
                requestDTO.supplementaryText!, beginDateArray, endDateArray, requestDTO.fmkversion,
                requestDTO.dosageProposalVersion);
        } else {
            return DosageProposalXMLGenerator.generateXMLSnippet(requestDTO.type, requestDTO.iteration,
                requestDTO.mapping, requestDTO.unitTextSingular, requestDTO.unitTextPlural,
                requestDTO.supplementaryText!, beginDateArray, endDateArray, requestDTO.fmkversion,
                requestDTO.dosageProposalVersion, requestDTO.shortTextMaxLength);
        }
    }

    public convertCombined(requestDTO: DosageWrapperWithOptionsDTO): DosageTranslationCombinedDTO | null {
        const options = this.convertLegacyOptions(requestDTO.options);
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        this.convertLegacyDateOrDateTime(dosage);
        let conversion = CombinedTextConverter.convert(dosage, options!);
        if (conversion === null) {
            return null;
        }

        let combinedTranslation = new DosageTranslationDTO(
            conversion.getCombinedShortText(),
            conversion.getCombinedLongText(),
            conversion.getCombinedDailyDosis()
        );

        let periodTranslations: DosageTranslationDTO[] = [];
        for (let periodText of conversion.getPeriodTexts()) {
            let periodTranslation = new DosageTranslationDTO(
                periodText[0],
                periodText[1],
                periodText[2]
            );
            periodTranslations.push(periodTranslation);
        }
        return new DosageTranslationCombinedDTO(combinedTranslation, periodTranslations);
    }

    public convertLongText(requestDTO: DosageWrapperWithOptionsDTO): string {
        let converter = Factory.getLongTextConverter();
        const options = this.convertLegacyOptions(requestDTO.options);
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        this.convertLegacyDateOrDateTime(dosage);
        return converter.convert(dosage, options);
    }

    public convertShortText(requestDTO: DosageWrapperWithOptionsAndMaxLengthDTO): string {
        const options = this.convertLegacyOptions(requestDTO.options);
        let converter = Factory.getShortTextConverter();
        let result: string;
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        this.convertLegacyDateOrDateTime(dosage);
        result = converter.convert(dosage, options, requestDTO.maxLength);
        return result;
    }

    public getShortTextConverterClassName(requestDTO: DosageWrapperWithMaxLengthDTO): string {
        let result: string;
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        this.convertLegacyDateOrDateTime(dosage);
        if (requestDTO.maxLength !== null && requestDTO.maxLength !== undefined) {
            result = Factory.getShortTextConverter().getConverterClassName(dosage,
                requestDTO.maxLength);
        } else {
            result = Factory.getShortTextConverter().getConverterClassName(dosage);
        }
        return result;
    }

    public getLongTextConverterClassName(requestDTO: DosageWrapperDTO): string {
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        this.convertLegacyDateOrDateTime(dosage);
        return Factory.getLongTextConverter().getConverterClassName(dosage);
    }

    public getDosageType(requestDTO: DosageWrapperDTO): DosageType {
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        this.convertLegacyDateOrDateTime(dosage);
        let dosageType = DosageTypeCalculator.calculate(dosage);
        return dosageType;
    }

    public getDosageType144(requestDTO: DosageWrapperDTO): DosageType {
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        this.convertLegacyDateOrDateTime(dosage);
        let dosageType = DosageTypeCalculator144.calculate(dosage);
        return dosageType;
    }

    public calculateDailyDosis(requestDTO: DosageWrapperDTO): DailyDosis {
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        this.convertLegacyDateOrDateTime(dosage);
        return DailyDosisCalculator.calculate(dosage);
    }

    private convertLegacyOptions(options: string | TextOptions | undefined): TextOptions | undefined {
        if (options) {
            switch (options) {
                case "STANDARD":
                case "0":
                    return TextOptions.STANDARD;

                case "VKA":
                case "1":
                    return TextOptions.VKA;

                case "VKA_WITH_MARKUP":
                case "2":
                    return TextOptions.VKA_WITH_MARKUP;
            }
        }
    }

    // TODO remove this when no clients send DateOrDateTime
    private convertLegacyDateOrDateTime(dosage: any) {
        function recurse(current: any): void {
            if (Array.isArray(current)) {
                for (const item of current) {
                    recurse(item);
                }
            } else if (typeof current === 'object' && current !== null) {
                for (const key of Object.keys(current)) {
                    const value = current[key];

                    if (key === 'startDateOrDateTime') {
                        if (value && typeof value === 'object') {
                            if ('dateTime' in value) {
                                // throw new Error('Invalid object: "startDateOrDateTime" contains a "dateTime" property.');
                                logger.warn('Invalid object: "startDateOrDateTime" contains a "dateTime" property. Dosage: ' + JSON.stringify(dosage));
                                current['startDate'] = TextHelper.formatDate(new Date(value.dateTime));
                            }
                            if ('date' in value) {
                                current['startDate'] = value.date;
                            }
                        }
                        delete current[key];
                    } else if (key === 'endDateOrDateTime') {
                        if (value && typeof value === 'object') {
                            if ('dateTime' in value) {
                                // throw new Error('Invalid object: "endDateOrDateTime" contains a "dateTime" property.');
                                logger.warn('Invalid object: "endDateOrDateTime" contains a "dateTime" property. Dosage: ' + JSON.stringify(dosage));
                                current['endDate'] = TextHelper.formatDate(new Date(value.dateTime));
                            }
                            if ('date' in value) {
                                current['endDate'] = value.date;
                            }
                        }
                        delete current[key];
                    } else {
                        recurse(value);
                    }
                }
            }
        }

        recurse(dosage);
    }
}

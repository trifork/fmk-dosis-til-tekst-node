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
    TextOptions
} from 'fmk-dosis-til-tekst-ts';
import { GetDosageProposalResultDTO } from '../models/request/GetDosageProposalResultDTO';
import { DosageWrapperWithOptionsDTO } from '../models/request/DosageWrapperWithOptionsDTO';
import { DosageWrapperWithOptionsAndMaxLengthDTO } from '../models/request/DosageWrapperWithOptionsAndMaxLengthDTO';
import { DosageWrapperWithMaxLengthDTO } from '../models/request/DosageWrapperWithMaxLengthDTO';
import { DosageWrapperDTO } from '../models/request/DosageWrapperDTO';
import { DosageTranslationDTO } from '../models/response/DosageTranslationDTO';
import { DosageTranslationCombinedDTO } from '../models/response/DosageTranslationCombinedDTO';


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
        return converter.convert(dosage, options);
    }

    public convertShortText(requestDTO: DosageWrapperWithOptionsAndMaxLengthDTO): string {
        const options = this.convertLegacyOptions(requestDTO.options);
        let converter = Factory.getShortTextConverter();
        let result: string;
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        result = converter.convert(dosage, options, requestDTO.maxLength);
        return result;
    }

    public getShortTextConverterClassName(requestDTO: DosageWrapperWithMaxLengthDTO): string {
        let result: string;
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
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
        return Factory.getLongTextConverter().getConverterClassName(dosage);
    }

    public getDosageType(requestDTO: DosageWrapperDTO): DosageType {
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        let dosageType = DosageTypeCalculator.calculate(dosage);
        return dosageType;
    }

    public getDosageType144(requestDTO: DosageWrapperDTO): DosageType {
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
        let dosageType = DosageTypeCalculator144.calculate(dosage);
        return dosageType;
    }

    public calculateDailyDosis(requestDTO: DosageWrapperDTO): DailyDosis {
        const dosage = requestDTO.dosageJson ? JSON.parse(requestDTO.dosageJson) : requestDTO.dosage;
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
}

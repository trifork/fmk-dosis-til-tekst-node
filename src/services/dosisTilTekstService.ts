import {
    CombinedTextConverter,
    DailyDosisCalculator,
    DosageProposalXML,
    DosageProposalXMLGenerator,
    DosageTypeCalculator,
    DosageTypeCalculator144,
    Factory
} from 'fmk-dosis-til-tekst-ts-commonjs';
import {GetDosageProposalResultDTO} from '../models/request/GetDosageProposalResultDTO';
import {DosageWrapperWithOptionsDTO} from '../models/request/DosageWrapperWithOptionsDTO';
import {DosageWrapperWithOptionsAndMaxLengthDTO} from '../models/request/DosageWrapperWithOptionsAndMaxLengthDTO';
import {DosageWrapperWithMaxLengthDTO} from '../models/request/DosageWrapperWithMaxLengthDTO';
import {DosageWrapperDTO} from '../models/request/DosageWrapperDTO';
import {DailyDosis} from 'fmk-dosis-til-tekst-ts-commonjs/dist/lib/DailyDosis';
import {DosageTranslationDTO} from '../models/response/DosageTranslationDTO';
import {DosageTranslationCombinedDTO} from '../models/response/DosageTranslationCombinedDTO';


export class DosisTilTekstService {
    public getDosageProposalResult(requestDTO: GetDosageProposalResultDTO): DosageProposalXML {
        let beginDateArray = [];
        let endDateArray = [];

        for (let i = 0; i < requestDTO.beginDates.length; i++) {
            let beginDateJS = new Date(requestDTO.beginDates[i]);
            beginDateArray.push(beginDateJS);

            let endDateJS: any = null;
            if (requestDTO.endDates[i] !== null) {
                endDateJS = new Date(requestDTO.endDates[i]);
            }

            endDateArray.push(endDateJS);
        }

        if (requestDTO.shortTextMaxLength === undefined) {
            return DosageProposalXMLGenerator.generateXMLSnippet(requestDTO.type, requestDTO.iteration,
                requestDTO.mapping, requestDTO.unitTextSingular, requestDTO.unitTextPlural,
                requestDTO.supplementaryText, beginDateArray, endDateArray, requestDTO.fmkversion,
                requestDTO.dosageProposalVersion);
        } else {
            return DosageProposalXMLGenerator.generateXMLSnippet(requestDTO.type, requestDTO.iteration,
                requestDTO.mapping, requestDTO.unitTextSingular, requestDTO.unitTextPlural,
                requestDTO.supplementaryText, beginDateArray, endDateArray, requestDTO.fmkversion,
                requestDTO.dosageProposalVersion, requestDTO.shortTextMaxLength);
        }
    }

    public convertCombined(requestDTO: DosageWrapperWithOptionsDTO): DosageTranslationCombinedDTO | null {
        let conversion = CombinedTextConverter.convertStr(requestDTO.dosageJson, requestDTO.options);
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
        return converter.convertStr(requestDTO.dosageJson, requestDTO.options);
    }

    public convertShortText(requestDTO: DosageWrapperWithOptionsAndMaxLengthDTO): string {
        let converter = Factory.getShortTextConverter();
        let result: string;
        if (requestDTO.maxLength !== null && requestDTO.maxLength !== undefined) {
            result = converter.convertStr(requestDTO.dosageJson, requestDTO.options, requestDTO.maxLength);
        } else {
            result = converter.convertStr(requestDTO.dosageJson, requestDTO.options);
        }
        return result;
    }

    public getShortTextConverterClassName(requestDTO: DosageWrapperWithMaxLengthDTO): string {
        let result: string;
        if (requestDTO.maxLength !== null && requestDTO.maxLength !== undefined) {
            result = Factory.getShortTextConverter().getConverterClassName(JSON.parse(requestDTO.dosageJson),
                requestDTO.maxLength);
        } else {
            result = Factory.getShortTextConverter().getConverterClassName(JSON.parse(requestDTO.dosageJson));
        }
        return result;
    }

    public getLongTextConverterClassName(requestDTO: DosageWrapperDTO): string {
        return Factory.getLongTextConverter().getConverterClassName(JSON.parse(requestDTO.dosageJson));
    }

    public getDosageType(requestDTO: DosageWrapperDTO): string {
        let dosageType = DosageTypeCalculator.calculateStr(requestDTO.dosageJson);
        return dosageType.toString();
    }

    public getDosageType144(requestDTO: DosageWrapperDTO): string {
        let dosageType = DosageTypeCalculator144.calculateStr(requestDTO.dosageJson);
        return dosageType.toString();
    }

    public calculateDailyDosis(requestDTO: DosageWrapperDTO): DailyDosis {
        return DailyDosisCalculator.calculateStr(requestDTO.dosageJson);
    }
}

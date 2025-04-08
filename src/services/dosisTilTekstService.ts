import {
    CombinedTextConverter,
    DailyDosisCalculator,
    DosageProposalXML,
    DosageProposalXMLGenerator,
    DosageTypeCalculator,
    DosageTypeCalculator144,
    Factory
} from 'fmk-dosis-til-tekst-ts-commonjs';
import { GetDosageProposalResultDTO } from '../models/request/GetDosageProposalResultDTO';
import { DosageWrapperWithOptionsDTO } from '../models/request/DosageWrapperWithOptionsDTO';
import { DosageWrapperWithOptionsAndMaxLengthDTO } from '../models/request/DosageWrapperWithOptionsAndMaxLengthDTO';
import { DosageWrapperWithMaxLengthDTO } from '../models/request/DosageWrapperWithMaxLengthDTO';
import { DosageWrapperDTO } from '../models/request/DosageWrapperDTO';
import { DailyDosis } from 'fmk-dosis-til-tekst-ts-commonjs/dist/lib/DailyDosis';
import { DosageTranslationDTO } from '../models/response/DosageTranslationDTO';
import { DosageTranslationCombinedDTO } from '../models/response/DosageTranslationCombinedDTO';


export class DosisTilTekstService {
    public health() {
        return '{"status":"OK"}';
    }

    public getDosageProposalResult(requestDTO: GetDosageProposalResultDTO): DosageProposalXML {
        this.fixDateOnlyStringsArray(requestDTO.beginDates);
        this.fixDateOnlyStringsArray(requestDTO.endDates);

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
        this.fixDateOnlyStrings(requestDTO);

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
        this.fixDateOnlyStrings(requestDTO);

        let converter = Factory.getLongTextConverter();
        return converter.convertStr(requestDTO.dosageJson, requestDTO.options);
    }

    public convertShortText(requestDTO: DosageWrapperWithOptionsAndMaxLengthDTO): string {
        this.fixDateOnlyStrings(requestDTO);

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
        this.fixDateOnlyStrings(requestDTO);

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
        this.fixDateOnlyStrings(requestDTO);

        return Factory.getLongTextConverter().getConverterClassName(JSON.parse(requestDTO.dosageJson));
    }

    public getDosageType(requestDTO: DosageWrapperDTO): string {
        this.fixDateOnlyStrings(requestDTO);

        let dosageType = DosageTypeCalculator.calculateStr(requestDTO.dosageJson);
        return dosageType.toString();
    }

    public getDosageType144(requestDTO: DosageWrapperDTO): string {
        this.fixDateOnlyStrings(requestDTO);

        let dosageType = DosageTypeCalculator144.calculateStr(requestDTO.dosageJson);
        return dosageType.toString();
    }

    public calculateDailyDosis(requestDTO: DosageWrapperDTO): DailyDosis {
        this.fixDateOnlyStrings(requestDTO);

        return DailyDosisCalculator.calculateStr(requestDTO.dosageJson);
    }

    private fixDateOnlyStrings(requestDTO: DosageWrapperDTO) {
        // Workaround: Modify date strings with format "2025-04-08" -> "2025-04-08 00:00:00"
        // Old fmk-dosistiltekst-wrapper uses java milliseconds-since-epoch longs to represent dates, and is unaffected by this workaround
        // The purpose of this workaround is to ensure that date-only strings sent by fmk-dosis-til-tekst-java-client are interpreted correctly
        // until this service can be upgraded to use fmk-dosis-til-tekst-ts-commonjs 2.*
        //
        // For further explanation see FMK-10650
        if (requestDTO.dosageJson) {
            const json = JSON.parse(requestDTO.dosageJson);

            this.fixDates(json)

            requestDTO.dosageJson = JSON.stringify(json);
        }
    }

    private fixDates(obj: unknown): void {
        if (Array.isArray(obj)) {
            for (const value of obj) {
                this.fixDates(value);
            }
        } else if (typeof obj === 'object' && obj !== null) {
            const entries = Object.entries(obj) as [string, unknown][];
            for (const [key, value] of entries) {
                if (key === "date" && typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    (obj as Record<string, unknown>)[key] = value + " 00:00:00";
                } else {
                    this.fixDates(value);
                }
            }
        }
    }

    private fixDateOnlyStringsArray(ar: string[]) {
        for (let i = 0; i < ar.length; i++) {
            const value = ar[i];
            if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                ar[i] = value + " 00:00:00";
            }
        }
    }
}

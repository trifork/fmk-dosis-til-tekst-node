import {
    CombinedTextConverter,
    type DailyDosis,
    DailyDosisCalculator,
    DefaultDosageRendererFactory,
    type DosageFormatterOptions,
    DosageProposalXML,
    DosageProposalXMLGenerator,
    DosageType,
    DosageTypeCalculator,
    DosageTypeCalculator144,
    type DosageV2,
    Factory,
    TextOptions
} from 'fmk-dosis-til-tekst-ts';
import { type DosageWrapperDTO } from '../models/request/DosageWrapperDTO.js';
import { type DosageWrapperWithMaxLengthDTO } from '../models/request/DosageWrapperWithMaxLengthDTO.js';
import { type DosageWrapperWithOptionsAndMaxLengthDTO } from '../models/request/DosageWrapperWithOptionsAndMaxLengthDTO.js';
import { type DosageWrapperWithOptionsDTO } from '../models/request/DosageWrapperWithOptionsDTO.js';
import { type GetDosageProposalResultDTO } from '../models/request/GetDosageProposalResultDTO.js';
import { DosageTranslationCombinedDTO } from '../models/response/DosageTranslationCombinedDTO.js';
import { DosageTranslationDTO } from '../models/response/DosageTranslationDTO.js';
import type { CombinedTranslation, DosageRenditionCombinedDTO } from '../models/response/DosageRenditionCombinedDTO.js';


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

        return DosageProposalXMLGenerator.generateXMLSnippet(requestDTO.type, requestDTO.iteration,
            requestDTO.mapping, requestDTO.unitTextSingular, requestDTO.unitTextPlural,
            requestDTO.supplementaryText!, beginDateArray, endDateArray, requestDTO.fmkversion,
            requestDTO.dosageProposalVersion, requestDTO.shortTextMaxLength);
    }

    public convertCombined(requestDTO: DosageWrapperWithOptionsDTO): DosageTranslationCombinedDTO | null {
        const options = this.convertLegacyOptions(requestDTO.options);
        const dosage = requestDTO.dosage;
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
        const dosage = requestDTO.dosage;
        return converter.convert(dosage, options);
    }

    public convertShortText(requestDTO: DosageWrapperWithOptionsAndMaxLengthDTO): string {
        const options = this.convertLegacyOptions(requestDTO.options);
        let converter = Factory.getShortTextConverter();
        let result: string;
        const dosage = requestDTO.dosage;
        result = converter.convert(dosage, options, requestDTO.maxLength);
        return result;
    }

    public getShortTextConverterClassName(requestDTO: DosageWrapperWithMaxLengthDTO): string {
        let result: string;
        const dosage = requestDTO.dosage;
        if (requestDTO.maxLength !== null && requestDTO.maxLength !== undefined) {
            result = Factory.getShortTextConverter().getConverterClassName(dosage,
                requestDTO.maxLength);
        } else {
            result = Factory.getShortTextConverter().getConverterClassName(dosage);
        }
        return result;
    }

    public getLongTextConverterClassName(requestDTO: DosageWrapperDTO): string {
        const dosage = requestDTO.dosage;
        return Factory.getLongTextConverter().getConverterClassName(dosage);
    }

    public getDosageType(requestDTO: DosageWrapperDTO): DosageType {
        const dosage = requestDTO.dosage;
        let dosageType = DosageTypeCalculator.calculate(dosage);
        return dosageType;
    }

    public getDosageType144(requestDTO: DosageWrapperDTO): DosageType {
        const dosage = requestDTO.dosage;
        let dosageType = DosageTypeCalculator144.calculate(dosage);
        return dosageType;
    }

    public calculateDailyDosis(requestDTO: DosageWrapperDTO): DailyDosis {
        const dosage = requestDTO.dosage;
        return DailyDosisCalculator.calculate(dosage);
    }

    public renderDosageCombined(dosage: DosageV2, options: DosageFormatterOptions): DosageRenditionCombinedDTO {

        const oneLineOptions: DosageFormatterOptions = {
            html: options?.html,
            oneLine: true,
            maxLength: options?.maxLength ?? 70
        }

        const multiLineOptions: DosageFormatterOptions = {
            html: options?.html,
            oneLine: false
            // maxLength only applies to oneLine
        }

        const oneLineRenderer = new DefaultDosageRendererFactory().getDosageRenderer(oneLineOptions);
        const multiLineRenderer = new DefaultDosageRendererFactory().getDosageRenderer(multiLineOptions);

        const shortText = oneLineRenderer.render(dosage);
        const longText = multiLineRenderer.render(dosage);

        let individualPeriods: CombinedTranslation[] = [{ LongText: longText, ShortText: shortText }];

        if (dosage.DosagePeriod?.length && dosage.DosagePeriod?.length > 1) {
            const dosageCopies = dosage.DosagePeriod.map(period => ({
                ...dosage,
                DosagePeriod: [period],
            }));

            individualPeriods = dosageCopies.map(d => ({
                ShortText: oneLineRenderer.render(d),
                LongText: multiLineRenderer.render(d)
            }));
        }

        const combined: DosageRenditionCombinedDTO = {
            CombinedTranslation: {
                LongText: longText,
                ShortText: shortText
            },
            PeriodTranslations: individualPeriods
        };

        return combined;
    }

    public renderDosage(dosage: DosageV2, options: DosageFormatterOptions): string {
        const renderer = new DefaultDosageRendererFactory().getDosageRenderer(options);
        return renderer.render(dosage);
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

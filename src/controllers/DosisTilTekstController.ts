import { Request as ExpressRequest } from 'express';
import { DailyDosis, DosageProposalXML, DosageType } from 'fmk-dosis-til-tekst-ts';
import { Body, Controller, Get, Post, Produces, Query, Request, Route } from 'tsoa';
import { DateFormattedString } from '../models/request/DateFormattedString';
import { DosageWrapperDTO } from '../models/request/DosageWrapperDTO';
import { DosageWrapperWithMaxLengthDTO } from '../models/request/DosageWrapperWithMaxLengthDTO';
import { DosageWrapperWithOptionsAndMaxLengthDTO } from '../models/request/DosageWrapperWithOptionsAndMaxLengthDTO';
import { DosageWrapperWithOptionsDTO } from '../models/request/DosageWrapperWithOptionsDTO';
import { GetDosageProposalResultDTO } from '../models/request/GetDosageProposalResultDTO';
import { TextOption } from '../models/request/TextOption';
import DosageProposalDTO from '../models/response/DosageProposalDTO';
import { DosageTranslationCombinedDTO } from '../models/response/DosageTranslationCombinedDTO';
import { DosisTilTekstService } from '../services/DosisTilTekstService';

@Route('')
export class DosisTilTekstController extends Controller {

    @Get('/health')
    @Produces("application/json")
    public health(): any {
        return new DosisTilTekstService().health();
    }

    @Post('/getDosageProposalResult')
    @Produces("application/xml")
    public postGetDosageProposalResult(@Body() requestBody: GetDosageProposalResultDTO): DosageProposalXML {
        return new DosisTilTekstService().getDosageProposalResult(requestBody);
    }

    /**
      * @isInt dosageProposalVersion
      * @isInt shortTextMaxLength
      */
    @Get('/getDosageProposalResult')
    @Produces("application/json")
    public getGetDosageProposalResult(
        @Query() type: string,
        @Query() iteration: string,
        @Query() mapping: string,
        @Query() unitTextSingular: string,
        @Query() unitTextPlural: string,
        @Query() beginDates: DateFormattedString[],
        @Query() fmkversion: string,
        @Query() dosageProposalVersion: number,
        @Query() supplementaryText?: string,
        @Query() endDates?: DateFormattedString[],
        @Query() shortTextMaxLength?: number
    ): DosageProposalDTO {
        const result = new DosisTilTekstService().getDosageProposalResult({
            type,
            iteration,
            mapping,
            unitTextSingular,
            unitTextPlural,
            beginDates,
            fmkversion,
            dosageProposalVersion,
            supplementaryText,
            endDates,
            shortTextMaxLength
        });

        const mappedResult: DosageProposalDTO = {
            xml: result.getXml(),
            shortDosageTranslation: result.getShortDosageTranslation(),
            longDosageTranslation: result.getLongDosageTranslation()
        };

        return mappedResult;
    }

    @Post('/convertCombined')
    @Produces("application/json")
    public postConvertCombined(@Body() requestBody: DosageWrapperWithOptionsDTO): DosageTranslationCombinedDTO | null {
        return new DosisTilTekstService().convertCombined(requestBody);
    }

    @Get('/convertCombined')
    @Produces("application/json")
    public getConvertCombined(@Query() dosageJson: string, @Query() options?: TextOption): DosageTranslationCombinedDTO | null {
        // GET requests are rerouted to POST For this path in order to make use of TSOA payload validation
        return null;
    }

    @Post('/convertLongText')
    @Produces("text/plain; charset=utf-8")
    public postConvertLongText(@Request() req: ExpressRequest, @Body() requestBody: DosageWrapperWithOptionsDTO): string {
        const result = new DosisTilTekstService().convertLongText(requestBody);

        req.res?.header("Content-Type", "text/plain; charset=utf-8")
        req.res?.send(result);
        return "";
    }

    @Get('/convertLongText')
    @Produces("text/plain; charset=utf-8")
    public getConvertLongText(@Request() req: ExpressRequest, @Query() dosageJson: string, @Query() options?: TextOption): string {
        // GET requests are rerouted to POST For this path in order to make use of TSOA payload validation
        return "";
    }

    @Post('/convertShortText')
    @Produces("text/plain; charset=utf-8")
    public postConvertShortText(@Request() req: ExpressRequest, @Body() requestBody: DosageWrapperWithOptionsAndMaxLengthDTO): string {
        const result = new DosisTilTekstService().convertShortText(requestBody);

        req.res?.header("Content-Type", "text/plain; charset=utf-8")
        req.res?.send(result);
        return "";
    }

    @Get('/convertShortText')
    @Produces("text/plain; charset=utf-8")
    public getConvertShortText(@Request() req: ExpressRequest, @Query() dosageJson: string, @Query() options?: TextOption, @Query() maxLength?: number): string {
        // GET requests are rerouted to POST For this path in order to make use of TSOA payload validation
        return "";
    }

    @Post('/getShortTextConverterClassName')
    @Produces("text/plain; charset=utf-8")
    public postGetShortTextConverterClassName(@Request() req: ExpressRequest, @Body() requestBody: DosageWrapperWithMaxLengthDTO): string {
        const result = new DosisTilTekstService().getShortTextConverterClassName(requestBody);

        req.res?.header("Content-Type", "text/plain; charset=utf-8")
        req.res?.send(result);
        return "";
    }

    @Get('/getShortTextConverterClassName')
    @Produces("text/plain; charset=utf-8")
    public getGetShortTextConverterClassName(@Request() req: ExpressRequest, @Query() dosageJson: string, @Query() options?: TextOption, @Query() maxLength?: number): string {
        // GET requests are rerouted to POST For this path in order to make use of TSOA payload validation
        return "";
    }

    @Post('/getLongTextConverterClassName')
    @Produces("text/plain; charset=utf-8")
    public postGetLongTextConverterClassName(@Request() req: ExpressRequest, @Body() requestBody: DosageWrapperDTO): string {
        const result = new DosisTilTekstService().getLongTextConverterClassName(requestBody);

        req.res?.header("Content-Type", "text/plain; charset=utf-8")
        req.res?.send(result);
        return "";
    }

    @Get('/getLongTextConverterClassName')
    @Produces("text/plain; charset=utf-8")
    public getGetLongTextConverterClassName(@Request() req: ExpressRequest, @Query() dosageJson: string): string {
        // GET requests are rerouted to POST For this path in order to make use of TSOA payload validation
        return "";
    }

    @Post('/getDosageType')
    @Produces("text/plain; charset=utf-8")
    public postGetDosageType(@Request() req: ExpressRequest, @Body() requestBody: DosageWrapperDTO): DosageType {
        const result = new DosisTilTekstService().getDosageType(requestBody);

        req.res?.header("Content-Type", "text/plain; charset=utf-8")
        req.res?.send(result.toString());
        return result;
    }

    @Get('/getDosageType')
    @Produces("text/plain; charset=utf-8")
    public getGetDosageType(@Request() req: ExpressRequest, @Query() dosageJson: string): DosageType {
        // GET requests are rerouted to POST For this path in order to make use of TSOA payload validation
        return null as any;
    }

    @Post('/getDosageType144')
    @Produces("text/plain; charset=utf-8")
    public postGetDosageType144(@Request() req: ExpressRequest, @Body() requestBody: DosageWrapperDTO): DosageType {
        const result = new DosisTilTekstService().getDosageType144(requestBody);

        req.res?.header("Content-Type", "text/plain; charset=utf-8")
        req.res?.send(result.toString());
        return result;
    }

    @Get('/getDosageType144')
    @Produces("text/plain; charset=utf-8")
    public getGetDosageType144(@Request() req: ExpressRequest, @Query() dosageJson: string): DosageType {
        // GET requests are rerouted to POST For this path in order to make use of TSOA payload validation
        return null as any;
    }

    @Post('/calculateDailyDosis')
    @Produces("application/json")
    public postCalculateDailyDosis(@Body() requestBody: DosageWrapperDTO): DailyDosis {
        return new DosisTilTekstService().calculateDailyDosis(requestBody);
    }

    @Get('/calculateDailyDosis')
    @Produces("application/json")
    public getCalculateDailyDosis(@Query() dosageJson: string): DailyDosis {
        // GET requests are rerouted to POST For this path in order to make use of TSOA payload validation
        return null as any;
    }
}


import {Body, Controller, Get, Post, Route} from 'tsoa';
import {GetDosageProposalResultDTO} from '../models/request/GetDosageProposalResultDTO';
import {DosisTilTekstService} from '../services/dosisTilTekstService';
import {DosageProposalXML} from 'fmk-dosis-til-tekst-ts-commonjs';
import {DailyDosis} from 'fmk-dosis-til-tekst-ts-commonjs/dist/lib/DailyDosis';
import {DosageWrapperWithOptionsDTO} from '../models/request/DosageWrapperWithOptionsDTO';
import {DosageWrapperWithMaxLengthDTO} from '../models/request/DosageWrapperWithMaxLengthDTO';
import {DosageWrapperWithOptionsAndMaxLengthDTO} from '../models/request/DosageWrapperWithOptionsAndMaxLengthDTO';
import {DosageWrapperDTO} from '../models/request/DosageWrapperDTO';
import {DosageTranslationCombinedDTO} from '../models/response/DosageTranslationCombinedDTO';

@Route('')
export class DosisTilTekstController extends Controller {

    @Get('/health')
    public async health(): Promise<string> {
        this.setStatus(200);
        return new DosisTilTekstService().health();
    }

    @Post('/getDosageProposalResult')
    public async getDosageProposalResult(@Body() requestBody: GetDosageProposalResultDTO): Promise<DosageProposalXML> {
        this.setStatus(200);
        return new DosisTilTekstService().getDosageProposalResult(requestBody);
    }

    @Post('/convertCombined')
    public async convertCombined(@Body() requestBody: DosageWrapperWithOptionsDTO): Promise<DosageTranslationCombinedDTO | null> {
        this.setStatus(200);
        return new DosisTilTekstService().convertCombined(requestBody);
    }

    @Post('/convertLongText')
    public async convertLongText(@Body() requestBody: DosageWrapperWithOptionsDTO): Promise<string> {
        this.setStatus(200);
        return new DosisTilTekstService().convertLongText(requestBody);
    }

    @Post('/convertShortText')
    public async convertShortText(@Body() requestBody: DosageWrapperWithOptionsAndMaxLengthDTO): Promise<string> {
        this.setStatus(200);
        return new DosisTilTekstService().convertShortText(requestBody);
    }

    @Post('/getShortTextConverterClassName')
    public async getShortTextConverterClassName(@Body() requestBody: DosageWrapperWithMaxLengthDTO): Promise<string> {
        this.setStatus(200);
        return new DosisTilTekstService().getShortTextConverterClassName(requestBody);
    }

    @Post('/getLongTextConverterClassName')
    public async getLongTextConverterClassName(@Body() requestBody: DosageWrapperDTO): Promise<string> {
        this.setStatus(200);
        return new DosisTilTekstService().getLongTextConverterClassName(requestBody);
    }

    @Post('/getDosageType')
    public async getDosageType(@Body() requestBody: DosageWrapperDTO): Promise<string> {
        this.setStatus(200);
        return new DosisTilTekstService().getDosageType(requestBody);
    }

    @Post('/getDosageType144')
    public async getDosageType144(@Body() requestBody: DosageWrapperDTO): Promise<string> {
        this.setStatus(200);
        return new DosisTilTekstService().getDosageType144(requestBody);
    }

    @Post('/calculateDailyDosis')
    public async calculateDailyDosis(@Body() requestBody: DosageWrapperDTO): Promise<DailyDosis> {
        this.setStatus(200);
        return new DosisTilTekstService().calculateDailyDosis(requestBody);
    }
}

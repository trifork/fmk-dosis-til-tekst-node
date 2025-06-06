import { Dosage, TextOptions } from "fmk-dosis-til-tekst-ts";
import { DosageWrapperWithOptionsDTO } from "./DosageWrapperWithOptionsDTO";

export interface DosageWrapperWithOptionsAndMaxLengthDTO extends DosageWrapperWithOptionsDTO {
    maxLength?: number;
}

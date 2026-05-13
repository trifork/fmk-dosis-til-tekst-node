import { type Dosage, TextOptions } from "fmk-dosis-til-tekst-ts";
import { type DosageWrapperWithOptionsDTO } from "./DosageWrapperWithOptionsDTO.js";

export interface DosageWrapperWithOptionsAndMaxLengthDTO extends DosageWrapperWithOptionsDTO {
    maxLength?: number;
}

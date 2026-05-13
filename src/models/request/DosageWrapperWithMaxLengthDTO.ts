import { type DosageWrapperDTO } from "./DosageWrapperDTO.js";

export interface DosageWrapperWithMaxLengthDTO extends DosageWrapperDTO {
    maxLength?: number;
}

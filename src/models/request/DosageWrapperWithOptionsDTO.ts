import { type DosageWrapperDTO } from "./DosageWrapperDTO.js";
import { TextOption } from "./TextOption.js";

export interface DosageWrapperWithOptionsDTO extends DosageWrapperDTO {
   options?: TextOption
}

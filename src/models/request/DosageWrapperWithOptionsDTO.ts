import { DosageWrapperDTO } from "./DosageWrapperDTO";
import { TextOption } from "./TextOption";

export interface DosageWrapperWithOptionsDTO extends DosageWrapperDTO {
   options?: TextOption
}

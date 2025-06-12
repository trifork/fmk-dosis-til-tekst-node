import { Dosage } from "fmk-dosis-til-tekst-ts";

export interface DosageWrapperDTO {
  /** @deprecated */ dosageJson?: string;
  dosage?: Dosage;
}

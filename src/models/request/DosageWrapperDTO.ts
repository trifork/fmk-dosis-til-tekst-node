// TODO Use import on next line and remove LegacyDosage.ts when all clients are updated
// import { Dosage } from "fmk-dosis-til-tekst-ts";
import { Dosage } from "./LegacyDosage";

export interface DosageWrapperDTO {
  /** @deprecated */ dosageJson?: string;
  dosage?: Dosage;
}

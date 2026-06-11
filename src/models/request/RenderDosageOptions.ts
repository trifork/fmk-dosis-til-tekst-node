import type { DosageFormatterOptions } from "fmk-dosis-til-tekst-ts";

export class RenderDosageOptions {
    oneLine?: boolean;
    html?: boolean;
    maxLength?: number;
}

export class RenderDosageGETOptions extends RenderDosageOptions {
    dosageJson?: string;
}
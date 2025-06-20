
/**
 * Dosage start/end has been changed from DateOrDateTime to DateOnly in fmk-dosis-to-text-ts 2.0.2. 
 * The interfaces in this file are backward compatible with earlier versions of fmk-dosis-to-text-ts, 
 * and are ment for temporary use until clients (FMK) have been upgraded
 */

import { Day, UnitOrUnits } from "fmk-dosis-til-tekst-ts";

export interface Dosage {
    administrationAccordingToSchema?: AdministrationAccordingToSchema;
    freeText?: FreeText;
    structures?: Structures;
}

export interface AdministrationAccordingToSchema {
    startDateOrDateTime?: DateOrDateTime;
    startDate?: DateOnly;
    endDate?: DateOnly;
    endDateOrDateTime?: DateOrDateTime;
}

export interface FreeText {
    startDateOrDateTime?: DateOrDateTime;
    startDate?: DateOnly;
    endDate?: DateOnly;
    endDateOrDateTime?: DateOrDateTime;
    text: string;
}

export interface Structures {
    startDateOrDateTime?: DateOrDateTime;
    startDate?: DateOnly;
    endDate?: DateOnly;
    endDateOrDateTime?: DateOrDateTime;
    unitOrUnits: UnitOrUnits;
    structures: Structure[];
    isPartOfMultiPeriodDosage?: boolean;
}

export interface Structure {
    /**
      * @isInt iterationInterval must be specified in whole days
      * @minimum 0
      */
    iterationInterval: number;
    startDateOrDateTime?: DateOrDateTime;
    startDate?: DateOnly;
    endDate?: DateOnly;
    endDateOrDateTime?: DateOrDateTime;
    days: Day[];
    dosagePeriodPostfix?: string;
    supplText?: string;
}

/**
 * @format date
 * @isDate must be a valid date
 */
export type DateOnly = string;

export interface DateOrDateTime extends LegacyDateOnly, DateTime {

}

export interface LegacyDateOnly {
    /**
     * @format date
     * @isDate must be a valid date
     */
    date?: string;
}


export interface DateTime {
    /**
     * @format date-time
     * @isDateTime must be a valid datetime
     * @deprecated datetimes are no longer used
     */
    dateTime?: string;
}



import { AdministrationAccordingToSchema, Day, Dosage, Dose, FreeText, LocalTime, Structures, TimedDose } from "fmk-dosis-til-tekst-ts";

export interface AnnotatedDosage extends Dosage {
    administrationAccordingToSchema?: AdministrationAccordingToSchema;
    freeText?: FreeText;
    structures?: Structures;
}

export interface AnnotatedStructures extends Structures {
    structures: AnnotatedStructure[];
}

export interface AnnotatedStructure extends Structures {
    /**
      * @isInt iterationInterval must be specified in whole days
      */
    iterationInterval: number;
    days: AnnotatedDay[];
}

export interface AnnotatedDay extends Day {
    /**
     * @isInt dayNumber must be an integer value
     */
    dayNumber: number;
    allDoses: AnnotatedDose[];
}

export interface AnnotatedDose extends Dose {
}

export interface AnnotatedTimedDose extends TimedDose {
    time: AnnotatedLocalTime;
}

export interface AnnotatedLocalTime extends LocalTime {
    /**
     * @isInt hour must be an integer value
     */
    hour: number;
    /**
     * @isInt minute must be an integer value
     */
    minute: number;
    /**
     * @isInt second must be an integer value
     */
    second: number;
}
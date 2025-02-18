import { normalizeString, replaceAll } from "../common";
import { GherkinStep } from "../gherkinObject";
import { DataTable } from "./dataTable";
import { DocString } from "./docString";
import { UniqueObject } from "./uniqueObject";

export type Argument = DataTable | DocString;

/**
 * Model for Step
 */
export class Step extends UniqueObject {
    public static parse(obj: GherkinStep): Step {
        if (!obj || !obj.text) {
            throw new Error("The given object is not a Step!");
        }
        const { keyword, text, dataTable, docString } = obj;
        const step: Step = new Step(keyword, text);
        if (dataTable) {
            step.dataTable = DataTable.parse(dataTable);
        }
        if (docString) {
            step.docString = DocString.parse(docString);
        }
        return step;
    }

    /** Keyword of the Step */
    public keyword: "Given" | "When" | "Then" | "And" | "But" | "*" | string;
    /** Text of the Step */
    public text: string;
    /** CDataTable of the Step */
    public dataTable: DataTable;
    /** DocString of the Step */
    public docString: DocString;

    constructor(keyword: string, text: string) {
        super();
        this.keyword = normalizeString(keyword);
        this.text = normalizeString(text);
        this.dataTable = null;
        this.docString = null;
    }

    public clone(): Step {
        const step: Step = new Step(this.keyword, this.text);
        step.dataTable = this.dataTable ? this.dataTable.clone() : null;
        step.docString = this.docString ? this.docString.clone() : null;
        return step;
    }

    public replace(key: RegExp | string, value: string): void {
        this.text = replaceAll(this.text, key, value);
        this.dataTable && this.dataTable.replace(key, value);
        this.docString && this.docString.replace(key, value);
    }
}

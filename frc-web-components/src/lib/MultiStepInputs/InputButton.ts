import { QuickInputButton, Uri } from "vscode";

export default class InputButton implements QuickInputButton {
    constructor(public iconPath: { light: Uri; dark: Uri; }, public tooltip: string) { }
}
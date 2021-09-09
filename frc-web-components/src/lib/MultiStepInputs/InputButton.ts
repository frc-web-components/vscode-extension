import { QuickInputButton, Uri, ThemeIcon } from "vscode";

export default class InputButton implements QuickInputButton {
    constructor(public iconPath: { light: Uri; dark: Uri; } | ThemeIcon, public tooltip: string) { }
}


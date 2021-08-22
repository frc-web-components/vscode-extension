import * as vscode from "vscode";

export default interface IWebview {
    readonly scriptName : string;
    onCommand(command: string, data: any): any;
    postCommand(command: string, data: any): void;
    getExtensionUri(): vscode.Uri;
    getWebview(): vscode.Webview | null;
}
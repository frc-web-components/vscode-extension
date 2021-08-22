import * as vscode from "vscode";

export default interface IWebview {
    readonly scriptName : string;
    onDidReceiveMessage(message : any) : any;
    getExtensionUri(): vscode.Uri;
    getWebview(): vscode.Webview | null;
}
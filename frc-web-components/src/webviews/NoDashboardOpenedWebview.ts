import * as vscode from "vscode";
import CustomWebview from "../lib/CustomWebview";

export default class NoDashboardOpenedWebview extends CustomWebview {

    public readonly scriptName = 'no-dashboard-opened.js';

    public constructor(extensionUri: vscode.Uri) {
         super(extensionUri);
    }

    protected onDidReceiveMessage(message : any) : any {

    }
}
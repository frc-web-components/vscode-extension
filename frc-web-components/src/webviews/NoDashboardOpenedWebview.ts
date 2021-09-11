import * as vscode from "vscode";
import CustomWebviewView from "../lib/CustomWebviewView";
import CreateDashboardForm from "../quick-input/CreateDashboardForm";

export default class NoDashboardOpenedWebview extends CustomWebviewView {

    public readonly scriptName = 'no-dashboard-opened.js';

    public constructor(extensionUri: vscode.Uri) {
         super(extensionUri);
    }

    public onCommand(command: string, data: any) : any {
        if (command === 'createNewDashboard') {
            CreateDashboardForm.getDashoardCreatorForm().show();
        }
    }
}

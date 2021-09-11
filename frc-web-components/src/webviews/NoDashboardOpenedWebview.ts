import { window, Uri } from "vscode";
import CustomWebviewView from "../lib/CustomWebviewView";
import CreateDashboardForm from "../quick-input/CreateDashboardForm";

export default class NoDashboardOpenedWebview extends CustomWebviewView {

    public readonly scriptName = 'no-dashboard-opened.js';

    public constructor(extensionUri: Uri) {
         super(extensionUri);
    }

    public onCommand(command: string, data: any) : any {
        if (command === 'createNewDashboard') {
            CreateDashboardForm.getDashoardCreatorForm().show();
        } else if (command === 'openDashboard') {
            this.openDashboard();
        }
    }

    private async openDashboard() {
        const dashboardPath = await this.handleDialog();
        if (typeof dashboardPath !== 'undefined') {

        }
    }

    private async handleDialog(): Promise<string | undefined> {
        try {
            const uris = await window.showOpenDialog({
                canSelectMany: false,
                canSelectFiles: false,
                canSelectFolders: true,
            });
            if (typeof uris !== 'undefined') {
                const [{ fsPath }] = uris;
                return fsPath;
            }
        } catch (error) { }

        return undefined;
    }
}

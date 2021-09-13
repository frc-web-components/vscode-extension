import { window, Uri, commands } from "vscode";
import CustomWebviewView from "../lib/CustomWebviewView";
import CreateDashboardForm from "../quick-input/CreateDashboardForm";

const OPEN_DASHBOARD_DIALOG_ACTION = 'Open Dashboard';
const OPEN_DASHBOARD_CURRENT_WINDOW_ACTION = 'Current Window';
const OPEN_DASHBOARD_NEW_WINDOW_ACTION = 'New Window';

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

    private async openDashboard(defaultPath?: string) {
        const dashboardPath = await this.handleDialog(defaultPath);
        if (typeof dashboardPath === 'undefined') {
            return;
        }

        if (!this.isDashboard(dashboardPath.fsPath)) {
            const action = await window.showErrorMessage(
                'The directory you selected does not contain a valid dashboard.',
                OPEN_DASHBOARD_DIALOG_ACTION,
            );
            if (action === OPEN_DASHBOARD_DIALOG_ACTION) {
                this.openDashboard(dashboardPath.fsPath);
            }
        } else {
            const action = await window.showInformationMessage(
                'Would you like to open the dashboard in the current or new window?', 
                { modal: true }, 
                OPEN_DASHBOARD_CURRENT_WINDOW_ACTION, 
                OPEN_DASHBOARD_NEW_WINDOW_ACTION, 
            );
            if (action === OPEN_DASHBOARD_CURRENT_WINDOW_ACTION) {
                await commands.executeCommand('vscode.openFolder', dashboardPath, false);
            } else if (action === OPEN_DASHBOARD_NEW_WINDOW_ACTION) {
                await commands.executeCommand('vscode.openFolder', dashboardPath, true);
            }
        }
    }

    private async handleDialog(defaultPath?: string): Promise<Uri | undefined> {
        try {
            const uris = await window.showOpenDialog({

                canSelectMany: false,
                canSelectFiles: false,
                canSelectFolders: true,
                defaultUri: defaultPath ? Uri.file(defaultPath) : undefined,
            });
            if (typeof uris !== 'undefined') {
                const [uri] = uris;
                return uri;
            }
        } catch (error) { }

        return undefined;
    }

    private isDashboard(path: string): boolean {
        return true;
    }
}

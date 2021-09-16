import { commands, workspace, Uri } from 'vscode';
import { existsSync, lstatSync } from 'fs';
import { join } from 'path';

export default class WorkspaceDashboard {

    private static workspaceDashboard: WorkspaceDashboard;
    private readonly workspaceUri?: Uri;
    private isDashboardOpened = false;

    public static getWorkspaceDashboard(): WorkspaceDashboard {
        if (!WorkspaceDashboard.workspaceDashboard) {
            WorkspaceDashboard.workspaceDashboard = new WorkspaceDashboard();
        }
        return WorkspaceDashboard.workspaceDashboard;
    }

    private constructor() {
        this.workspaceUri = workspace.workspaceFolders?.[0]?.uri;
        const isDashboard = (
            typeof this.workspaceUri !== 'undefined' &&
            WorkspaceDashboard.isDashboard(this.workspaceUri.fsPath)
        );
        this.setIsDashboardOpened(isDashboard);
    }

    setIsDashboardOpened(opened: boolean) {
		this.isDashboardOpened = opened;
		commands.executeCommand('setContext', 'frcWebComponents.isDashboardOpened', opened);
	}

    getIsDashboardOpened(): boolean {
        return this.isDashboardOpened;
    }

    static isDashboard(path: string): boolean {
        const dashboardSettingsFolder = join(path, '.frc-web-components');
        if (!existsSync(dashboardSettingsFolder)) {
            return false;
        }
        return lstatSync(dashboardSettingsFolder).isDirectory();
    }
}
import { commands, workspace, Uri, ExtensionContext } from 'vscode';
import { existsSync, lstatSync } from 'fs';
import { join } from 'path';
import { readFile, readdirSync } from 'fs';

async function readFileAsync(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        readFile(path, "utf8", (err, content) => {
            if (err) {
                reject(err);
            } else {
                resolve(content.toString());
            }
        });
    });
};

export default class WorkspaceDashboard {

    private static workspaceDashboard: WorkspaceDashboard;
    private static extensionContext?: ExtensionContext;
    private readonly workspaceUri?: Uri;
    private isDashboardOpened = false;

    static getExtensionContext(): ExtensionContext {
        if (!WorkspaceDashboard.extensionContext) {
            throw new Error('Extension context has not been set');
        }
        return WorkspaceDashboard.extensionContext;
    }

    static getTemplateFolderPath(): string {
        const context = WorkspaceDashboard.getExtensionContext();
        return join(context.extensionPath, 'templates');
    }

    static async getTemplates(): Promise<Map<string, Object>> {
        const templateFolderPath = WorkspaceDashboard.getTemplateFolderPath();
        const directoryNames = readdirSync(templateFolderPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        const templates = new Map<string, Object>();
        for (const name of directoryNames) {
            const path = join(templateFolderPath, name);
            const configPath = join(path, 'config.js');
            const codePath = join(path, 'code');
            const config = JSON.parse(await readFileAsync(configPath));
            templates.set(name, {
                configPath,
                codePath,
                config,
            });
        }
        return templates;
    }

    static setExtensionContext(context: ExtensionContext) {
        WorkspaceDashboard.extensionContext = context;
    }

    static getWorkspaceDashboard(): WorkspaceDashboard {
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
import * as vscode from 'vscode';
import CustomWebviewPanel from './lib/CustomWebviewPanel';
import CustomWebviewView from './lib/CustomWebviewView';
import NoDashboardOpenedWebview from './webviews/NoDashboardOpenedWebview';


export function activate(context: vscode.ExtensionContext) {

	const noDashboardWebview = new NoDashboardOpenedWebview(context.extensionUri);
	const webviewPanel = new CustomWebviewPanel(noDashboardWebview);
	const webviewView = new CustomWebviewView(noDashboardWebview);

	let isDashboardOpened: boolean;

	const setDashboardOpened = (opened: boolean) => {
		isDashboardOpened = opened;
		vscode.commands.executeCommand('setContext', 'frcWebComponents.isDashboardOpened', opened);
	};

	setDashboardOpened(false);

	context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from FRC Web Components!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.showWebview', () => {
		webviewPanel.open();
	}));

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("frc-web-components-no-dashboard-opened", webviewView)
	);
}

export function deactivate() { }

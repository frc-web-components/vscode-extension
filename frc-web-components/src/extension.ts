import * as vscode from 'vscode';
import NoDashboardOpenedWebview from './webviews/NoDashboardOpenedWebview';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension activated');

	const noDashboardWebview = new NoDashboardOpenedWebview(context.extensionUri);

	let isDashboardOpened: boolean;

	const setDashboardOpened = (opened: boolean) => {
		isDashboardOpened = opened;
		vscode.commands.executeCommand('setContext', 'frcWebComponents.isDashboardOpened', opened);
	};

	setDashboardOpened(false);

	context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from FRC Web Components!');
	}));

	// context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.showWebview', () => {
	// 	webviewPanel.open();
	// }));

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("frc-web-components-no-dashboard-opened", noDashboardWebview)
	);

}

export function deactivate() { }



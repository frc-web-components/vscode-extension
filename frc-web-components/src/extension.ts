import * as vscode from 'vscode';
import Webview from './Webview';

export function activate(context: vscode.ExtensionContext) {

	const webview = new Webview(context.extensionUri);

	context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from FRC Web Components!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.showWebview', () => {
		webview.open();
	}));
}

export function deactivate() { }

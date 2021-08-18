import * as vscode from 'vscode';
import CustomWebview from './CustomWebview';
import CustomWebviewPanel from './CustomWebviewPanel';
import CustomWebviewView from './CustomWebviewView';



export function activate(context: vscode.ExtensionContext) {

	const webview = new CustomWebview(context.extensionUri);
	const webviewPanel = new CustomWebviewPanel(webview);
	const webviewView = new CustomWebviewView(webview);

	let isProjectOpened: boolean;

	const setProjectOpened = (opened: boolean) => {
		isProjectOpened = opened;
		vscode.commands.executeCommand('setContext', 'frcWebComponents.isProjectOpened', opened);
	};

	setProjectOpened(false);

	context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from FRC Web Components!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.showWebview', () => {
		webviewPanel.open();
	}));

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("frc-web-components-no-project-opened", webviewView)
	);
}

export function deactivate() { }

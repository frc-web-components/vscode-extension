import * as vscode from 'vscode';
import NoDashboardOpenedWebview from './webviews/NoDashboardOpenedWebview';
import MultiStepInputs from './lib/MultiStepInputs';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension activated');

	const noDashboardWebview = new NoDashboardOpenedWebview(context.extensionUri);
	const dashboardCreator = new MultiStepInputs('Create New Dashboard');
	dashboardCreator.addTextInput({
		placeholder: 'Dashboard Name', 
		description: 'Enter a name for your dashboard',
		required: true,
	});
	dashboardCreator.addTextInput({
		placeholder: 'wee'
	});

	let isDashboardOpened: boolean;

	const setDashboardOpened = (opened: boolean) => {
		isDashboardOpened = opened;
		vscode.commands.executeCommand('setContext', 'frcWebComponents.isDashboardOpened', opened);
	};

	setDashboardOpened(false);

	context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from FRC Web Components!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('frc-web-components.newDashboard', () => {
		dashboardCreator.show();
	}));

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("frc-web-components-no-dashboard-opened", noDashboardWebview)
	);

}

export function deactivate() { }



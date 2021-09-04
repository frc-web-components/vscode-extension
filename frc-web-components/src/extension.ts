import * as vscode from 'vscode';
import NoDashboardOpenedWebview from './webviews/NoDashboardOpenedWebview';
import MultiStepInputs from './lib/MultiStepInputs';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension activated');

	const noDashboardWebview = new NoDashboardOpenedWebview(context.extensionUri);
	const dashboardCreator = new MultiStepInputs('Create New Dashboard');
	dashboardCreator.addTextInput('dashboardName', {
		placeholder: 'Dashboard Name',
		description: 'Enter a name for your dashboard',
		required: true,
	});

	dashboardCreator.addQuickPickInput('quickPick', {
		canSelectMany: false,
		items: [
			{ id: 'a', label: 'AA' },
			{ id: 'b', label: 'BB', picked: true },
			{ id: 'c', label: 'CC', picked: true }
		]
	});


	dashboardCreator.addTextInput('wee', {
		placeholder: 'wee'
	});

	dashboardCreator.onSubmit(values => {
		for (const [inputId, value] of values.entries()) {
			console.log('on submit:', inputId, value);
		}
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



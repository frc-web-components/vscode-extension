import { commands, ExtensionContext, window } from 'vscode';
import NoDashboardOpenedWebview from './webviews/NoDashboardOpenedWebview';
import CreateDashboardForm from './quick-input/CreateDashboardForm';
import WorkspaceDashboard from './WorkspaceDashboard';

export function activate(context: ExtensionContext) {

	console.log('Extension activated');

	WorkspaceDashboard.setExtensionContext(context);
	const workspaceDashboard = WorkspaceDashboard.getWorkspaceDashboard();

	console.log('is dashboard opened:', workspaceDashboard.getIsDashboardOpened());

	const noDashboardWebview = new NoDashboardOpenedWebview(context.extensionUri);
	const createDashboardForm = CreateDashboardForm.getDashoardCreatorForm();
	
	context.subscriptions.push(commands.registerCommand('frc-web-components.helloWorld', () => {
		window.showInformationMessage('Hello World from FRC Web Components!');
	}));

	context.subscriptions.push(commands.registerCommand('frc-web-components.newDashboard', () => {
		createDashboardForm.show();
	}));

	context.subscriptions.push(
		window.registerWebviewViewProvider("frc-web-components-no-dashboard-opened", noDashboardWebview)
	);

}

export function deactivate() { }



import MultiStepInputs from "../lib/MultiStepInputs";

export default class CreateDashboardForm {

    private readonly dashboardCreator;

    constructor() {
        this.dashboardCreator = new MultiStepInputs('Create New Dashboard');

        this.dashboardCreator.addQuickPickInput('dashboardTemplate', {
            placeholder: "Select a dashboard template",
            canSelectMany: false,
            items: [
                {
                    id: 'emptyDashboard',
                    picked: true,
                    label: 'Empty Dashboard',
                    description: 'A bare-bones dashboard with only what you need to get started'
                },
                {
                    id: 'gyroMecanum',
                    label: 'Gyro Mecanum',
                    description: `A dashboard for the 'Gyro Mecanum' example progam showing how to perform mecanum drive with field oriented controls.`,
                },
                {
                    id: 'gearsBot',
                    label: 'GearsBot',
                    description: `A dashboard for the 'Gearsbot' CommandBased example program for WPIs GearsBot robot, ported to the new CommandBased library. Also contains simulation components that work if the websocket simulation extension is running.`,
                },
                {
                    id: 'simpleDifferentialDriveSimulation',
                    label: 'Simple Differential Drive Simulation',
                    description: `A dashboard for the 'simpleDifferentialDriveSimulation' example, a minimal drivetrain simulation project without the command-based library.`,
                },
            ]
        });

        this.dashboardCreator.addFileExplorerInputStep('baseFolder', {
            placeholder: 'Base Folder',
            description: 'Select a base folder to place the new dashboard project into.',
            required: true,
        });

        this.dashboardCreator.addTextInput('dashboardName', {
            placeholder: 'Dashboard Name',
            description: 'A name for your dashboard project.',
            required: true,
        });

        this.dashboardCreator.addQuickPickInput('createNewFolder', {
            canSelectMany: false,
            items: [
                {
                    id: 'yes',
                    picked: true,
                    label: 'Yes',
                    description: `This creates a new folder at Base Folder\\Project Name. Highly recommended to be checked. Otherwise the folder will be placed at Base Folder and not utilize the Project Name.`
                },
                { id: 'no', label: 'No' },
            ]
        });

        this.dashboardCreator.addTextInput('teamNumber', {
            placeholder: 'Team Number',
            required: true,
        });

        this.onSubmit(() => {
            this.createDashboard();
        });
    }

    onSubmit(callback: (inputValues: Map<string, any>) => any) {
        this.dashboardCreator.onSubmit(callback);
    }

    show() {
        this.dashboardCreator.show();
    }

    private createDashboard() {
        const values = this.dashboardCreator.getValues();
        console.log('values:', values);
    }
}
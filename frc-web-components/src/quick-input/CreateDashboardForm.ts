import MultiStepInputs from "../lib/MultiStepInputs";
import { QuickPickItemWithId } from "../lib/MultiStepInputs/QuickPickInputStep";
import WorkspaceDashboard, { Template } from "../WorkspaceDashboard";

export default class CreateDashboardForm {

    private readonly dashboardCreator;
    private templates?: Map<string, Template>;
    private static dashboardCreatorForm?: CreateDashboardForm;

    public static getDashoardCreatorForm() {
        if (!CreateDashboardForm.dashboardCreatorForm) {
            CreateDashboardForm.dashboardCreatorForm = new CreateDashboardForm();
        }
        return CreateDashboardForm.dashboardCreatorForm;
    }

    private constructor() {
        this.dashboardCreator = new MultiStepInputs('Create New Dashboard');        
        this.onSubmit(() => {
            this.createDashboard();
        });
    }

    private async initForm() {
        this.templates = await WorkspaceDashboard.getTemplates();
        const templateItems: QuickPickItemWithId[] = [];
        this.templates.forEach((template, id) => {
            const { description, name, isDefault } = template.config;
            templateItems.push({
                id,
                label: name,
                description,
                picked: isDefault,
            });
        });
        
        this.dashboardCreator.addQuickPickInput('dashboardTemplate', {
            placeholder: "Select a dashboard template",
            canSelectMany: false,
            items: templateItems,
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
    }

    onSubmit(callback: (inputValues: Map<string, any>) => any) {
        this.dashboardCreator.onSubmit(callback);
    }

    async show() {
        if (typeof this.templates === 'undefined') {
            await this.initForm();
        }
        this.dashboardCreator.show();
    }

    private createDashboard() {
        const values = this.dashboardCreator.getValues();
        console.log('values:', values);
    }
}
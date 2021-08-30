import { QuickInputButtons } from "vscode";
import InputStep from "./InputStep";
import TextInputStep from "./TextInputStep";

type TextInputProps = {
    placeholder?: string,
    description?: string,
    required?: boolean,
};

type InputUpdateListener = (inputId: string, value: any) => any;

type InputSubmitListener = (inputValues: Map<string, any>) => any;

type InputWithId = {
    inputId: string,
    inputStep: InputStep,
};

export default class MultiStepInputs {

    private inputSteps: InputWithId[] = [];
    private currentStep: number = 0;
    private readonly title: string;
    private onChangeListeners: InputUpdateListener[] = [];
    private onDidAcceptListeners: InputUpdateListener[] = [];
    private onSubmitListeners: InputSubmitListener[] = [];
    
    public constructor(title: string) {
        this.title = title;
    }

    private addInputStep(inputId: string, inputStep: InputStep): void {
        if (this.hasInputWithId(inputId)) {
            throw new Error(`Cannot add duplicate input step ${inputId}`);
        }

        inputStep.setTitle(this.title);
        inputStep.setStep(this.inputSteps.length + 1);
        inputStep.onChange(() => {
            inputStep.validate();
            const value = inputStep.getValue();
            this.onChangeListeners.forEach(listener => listener(inputId, value));
        });
        inputStep.onDidAccept(() => {
            if (inputStep.validate()) {
                const value = inputStep.getValue();
                this.onDidAcceptListeners.forEach(listener => listener(inputId, value));
                this.goForwardStep();
            }
        });
        inputStep.onDidTriggerButton(item => {
            if (item === QuickInputButtons.Back) {
                this.goBackStep();
            }
        });
        this.inputSteps.push({ inputId, inputStep });
        this.inputSteps.forEach(({ inputStep }) => {
            inputStep.setTotalSteps(this.inputSteps.length);
        });
    }

    public addOpenDirectoryInput(placeholder: string, description: string): void {

    }

    public addQuickPickInput(options: string[], placeholder: string, description: string): void {

    }

    public addMultiQuickPickInput(options: string[], placeholder: string, description: string): void {

    }

    public addTextInput(inputId: string, {
        placeholder = '',
        description = '',
        required = false,
    }: TextInputProps = {}): void {
        const textInputStep = new TextInputStep();
        textInputStep.setPlaceholder(placeholder);
        textInputStep.setDescription(description);
        if (required) {
            textInputStep.setRequired();
        }
        this.addInputStep(inputId, textInputStep);
    }

    public goBackStep(): void {
        this.goToStep(this.currentStep - 1);
    }

    public goForwardStep(): void {
        if (this.currentStep === this.inputSteps.length - 1) {
            const values = this.getValues();
            this.onSubmitListeners.forEach(listener => listener(values));
            this.hide();
        } else {
            this.goToStep(this.currentStep + 1);
        }
    }

    public restart(): void {
        for (let { inputStep } of this.inputSteps) {
            inputStep.clearValue();
        }
        this.goToStep(0);
    }

    public goToStep(step: number): void {
        if (step >= this.inputSteps.length || step < 0) {
            return;
        }
        this.currentStep = step;
        const { inputStep } = this.inputSteps[this.currentStep];
        inputStep.show();
    }

    public show(): void {
        const { inputStep } = this.inputSteps[this.currentStep];
        inputStep.show();
    }

    public hide(): void {
        const { inputStep } = this.inputSteps[this.currentStep];
        inputStep.hide();
    }

    public onChange(listener: InputUpdateListener): void {
        this.onChangeListeners.push(listener);
    }

    public onDidAccept(listener: InputUpdateListener): void {
        this.onDidAcceptListeners.push(listener);
    }

    public onSubmit(listener: InputSubmitListener): void {
        this.onSubmitListeners.push(listener);
    }

    public getValues(): Map<string, any> {
        return new Map<string, any>(
            this.inputSteps.map(({ inputId, inputStep }) => ([
                inputId,
                inputStep.getValue(),
            ]))
        );
    }

    private hasInputWithId(inputId: string): boolean {
        return this.inputSteps.findIndex(({ inputId: id }) => id === inputId) > -1;
    }
};
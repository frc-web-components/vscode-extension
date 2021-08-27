import * as vscode from "vscode";
import InputStep from "./InputStep";
import TextInputStep from "./TextInputStep";

export default class MultiStepInputs {

    private inputSteps: InputStep[] = [];
    private currentStep: number = 0;
    private readonly title: string;
    private stepValues = new Map<InputStep, any>();

    public constructor(title: string) {
        this.title = title;
    }

    private addInputStep(inputStep: InputStep): void {
        inputStep.setTitle(this.title);
        inputStep.setStep(this.inputSteps.length + 1);
        this.stepValues.set(inputStep, inputStep.getValue());
        inputStep.onChange(() => {
            if (inputStep.validate()) {
                this.stepValues.set(inputStep, inputStep.getValue());
                this.goForwardStep();
            }
        });
        inputStep.onDidTriggerButton(item => {
            if (item === vscode.QuickInputButtons.Back) {
                this.goBackStep();
            }
        });
        this.inputSteps.push(inputStep);
    }

    public addOpenDirectoryInput(placeholder: string, description: string): void {

    }

    public addQuickPickInput(options: string[], placeholder: string, description: string): void {

    }

    public addMultiQuickPickInput(options: string[], placeholder: string, description: string): void {

    }

    public addTextInput(placeholder: string, description: string): void {
        const textInputStep = new TextInputStep();
        textInputStep.setPlaceholder(placeholder);
        textInputStep.setDescription(description);
        this.addInputStep(textInputStep);
    }

    public goBackStep(): void {
        this.goToStep(this.currentStep - 1);
    }

    public goForwardStep(): void {
        this.goToStep(this.currentStep + 1);
    }

    public restart(): void {
        for (let inputStep of this.inputSteps) {
            inputStep.clearValue();
        }
        this.goToStep(0);
    }

    public goToStep(step: number): void {
        if (step >= this.inputSteps.length || step < 0) {
            return;
        }

        this.currentStep = step;
        this.inputSteps[this.currentStep].show();
        for (let i = this.currentStep + 1; i < this.inputSteps.length; i++) {
            this.inputSteps[i].clearValue();
        }
    }

    public show(): void {
        this.inputSteps[this.currentStep].show();
    }

    public hide(): void {
        this.inputSteps[this.currentStep].hide();
    }
};
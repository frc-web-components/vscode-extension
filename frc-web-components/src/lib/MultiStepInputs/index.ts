import * as vscode from "vscode";
import InputStep from "./InputStep";

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
        inputStep.onChange(() => {
            if (inputStep.isValid()) {
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

    }

    public goBackStep(): void {
        this.goToStep(this.currentStep - 1);
    }

    public goForwardStep(): void {
        this.goToStep(this.currentStep + 1);
    }

    public restart(): void {
        this.goToStep(0);
    }

    public goToStep(step: number): void {
        if (step >= this.inputSteps.length || step < 0) {
            return;
        }
    }

    public show(): void {

    }

    public hide(): void {

    }
};
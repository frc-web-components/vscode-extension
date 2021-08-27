import * as vscode from "vscode";
import InputStep from "./InputStep";

export default class MultiStepInputs {

    private inputSteps: InputStep[] = [];
    private currentStep: number = 0;

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
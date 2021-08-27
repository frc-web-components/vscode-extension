import { QuickInputButton, Disposable, window, InputBox } from "vscode";
import InputStep from "./InputStep";

export default class TextInputStep implements InputStep {

    private inputBox = window.createInputBox();
    private isRequired = false;

    setTitle(title: string): void {
        this.inputBox.title = title;
    }
    setStep(step: number): void {
        this.inputBox.step = step;
    }
    setTotalSteps(stepCount: number): void {
        this.inputBox.totalSteps = stepCount;
    }
    setPlaceholder(placeholder: string): void {
        this.inputBox.placeholder = placeholder;
    }
    setDescription(description: string): void {
        this.inputBox.prompt = description;
    }
    setRequired(): void {
        this.isRequired = true;
    }
    getValue() {
        return this.inputBox.value;
    }
    show(): void {
        this.inputBox.show();
    }
    hide(): void {
        this.inputBox.hide();
    }
    onChange(listener: Function): void {
        this.inputBox.onDidChangeValue((e: string) => {
            listener();
        });
    }
    onDidTriggerButton(listener: (e: QuickInputButton) => any): Disposable {
        return this.inputBox.onDidTriggerButton(listener);
    }

    validate(): boolean {
        if (this.isRequired && this.getValue() === '') {
            this.inputBox.validationMessage = 'This field is required.';
            return false;
        }

        this.inputBox.validationMessage = '';
        return true;
    }

    setValue(value: any): void {
        this.inputBox.value = value;
    }

    clearValue(): void {
        this.setValue('');
    }
}
import { QuickInputButton, Disposable, window, InputBox } from "vscode";
import InputStep from "./InputStep";

export default class TextInputStep implements InputStep {

    private inputBox: InputBox | undefined;
    private title = '';
    private step = 1;
    private totalSteps = 1;
    private placeholder = '';
    private description = '';
    private isRequired = false;
    private onChangeListener: Function | undefined;
    private onDidTriggerButtonListener: ((e: QuickInputButton) => any) | undefined;
    private disposables: Disposable[] = [];

    setTitle(title: string): void {
        this.title = title;
        if (this.inputBox) {
            this.inputBox.title = title;
        }
    }
    setStep(step: number): void {
        this.step = step;
        if (this.inputBox) {
            this.inputBox.step = step;
        }
    }
    setTotalSteps(stepCount: number): void {
        this.totalSteps = stepCount;
        if (this.inputBox) {
            this.inputBox.totalSteps = stepCount;
        }
    }
    setPlaceholder(placeholder: string): void {
        this.placeholder = placeholder;
        if (this.inputBox) {
            this.inputBox.placeholder = placeholder;
        }
    }
    setDescription(description: string): void {
        this.description = description;
        if (this.inputBox) {
            this.inputBox.prompt = description;
        }
    }
    setRequired(): void {
        this.isRequired = true;
    }
    getValue() {
        return this.inputBox?.value;
    }
    show(): void {
        if (this.inputBox) {
            this.inputBox.hide();
        }
        this.inputBox = window.createInputBox();;
        this.inputBox.show();
        this.inputBox.title = this.title;
        this.inputBox.step = this.step;
        this.inputBox.totalSteps = this.totalSteps;
        this.inputBox.placeholder = this.placeholder;
        this.inputBox.prompt = this.description;
        this.disposables.push(this.inputBox.onDidChangeValue((e: string) => {
            if (this.onChangeListener) {
                this.onChangeListener();
            }
        }));
        this.disposables.push(this.inputBox.onDidTriggerButton((e: QuickInputButton) => {
            if (this.onDidTriggerButtonListener) {
                this.onDidTriggerButtonListener(e);
            }
        }));
    }
    hide(): void {
        this.inputBox?.dispose();
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
    }
    onChange(listener: Function): void {
        this.onChangeListener = listener;
    }
    onDidTriggerButton(listener: (e: QuickInputButton) => any): void {
        this.onDidTriggerButtonListener = listener;
    }

    validate(): boolean {
        if (!this.inputBox) {
            return false;
        }

        if (this.isRequired && this.getValue() === '') {
            this.inputBox.validationMessage = 'This field is required.';
            return false;
        }

        this.inputBox.validationMessage = '';
        return true;
    }

    setValue(value: any): void {
        if (this.inputBox) {
            this.inputBox.value = value;
        }
    }

    clearValue(): void {
        this.setValue('');
    }
}
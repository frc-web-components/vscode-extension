import { QuickInputButton, QuickInputButtons, Disposable, window, InputBox } from "vscode";
import InputStep from "./InputStep";

export default class TextInputStep implements InputStep {

    private inputBox?: InputBox;
    private title = '';
    private step = 1;
    private totalSteps = 1;
    private placeholder = '';
    private description = '';
    private isRequired = false;
    private value = '';
    private onChangeListener?: Function;
    private onDidAcceptListener?: Function;
    private onDidTriggerButtonListener?: (e: QuickInputButton) => any;
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
            this.inputBox.step = this.totalSteps > 1 ? step : undefined;
            this.setInputButtons();
        }
    }
    setTotalSteps(stepCount: number): void {
        this.totalSteps = stepCount;
        if (this.inputBox) {
            this.inputBox.totalSteps = stepCount > 1 ? stepCount : undefined;
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
        return this.value;
    }
    show(): void {
        if (this.inputBox) {
            this.inputBox.hide();
        }
        this.inputBox = window.createInputBox();
        this.inputBox.show();
        this.inputBox.title = this.title;
        if (this.totalSteps > 1) {
            this.inputBox.step = this.step;
            this.inputBox.totalSteps = this.totalSteps;
        }
        this.inputBox.value = this.value;
        this.inputBox.placeholder = this.placeholder;
        this.inputBox.prompt = this.description;
        this.disposables.push(this.inputBox.onDidChangeValue((e: string) => {
            this.value = this.inputBox?.value ?? '';
            if (this.onChangeListener) {
                this.onChangeListener();
            }
        }));
        this.disposables.push(this.inputBox.onDidAccept((e: void) => {
            if (this.onDidAcceptListener) {
                this.onDidAcceptListener();
            }
        }));
        this.disposables.push(this.inputBox.onDidTriggerButton((e: QuickInputButton) => {
            if (this.onDidTriggerButtonListener) {
                this.onDidTriggerButtonListener(e);
            }
        }));
        this.setInputButtons();
    }
    hide(): void {
        this.inputBox?.dispose();
        this.disposables.forEach(disposable => disposable.dispose());
        this.disposables = [];
    }

    onChange(listener: Function): void {
        this.onChangeListener = listener;
    }

    onDidAccept(listener: Function): void {
        this.onDidAcceptListener = listener;
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
        this.value = value;
        if (this.inputBox) {
            this.inputBox.value = value;
        }
    }

    clearValue(): void {
        this.setValue('');
    }

    private setInputButtons() {
        if (this.inputBox) {
            this.inputBox.buttons = this.step > 1 ? [QuickInputButtons.Back] : [];
        }
    }
}
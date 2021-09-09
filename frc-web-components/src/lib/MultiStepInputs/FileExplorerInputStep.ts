import {
    QuickInputButton,
    Disposable,
    window,
    InputBox,
} from "vscode";
import InputStep from "./InputStep";
import { backButton, openFolderButton } from "./buttons";
import { existsSync, lstatSync } from 'fs';

export default class FileExplorerInputStep implements InputStep {

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
    private dialogTitle?: string;
    private dialogOpenLabel?: string;

    setDialogTitle(title: string | undefined): void {
        this.dialogTitle = title;
    }

    setDialogOpenLabel(label: string | undefined): void {
        this.dialogOpenLabel = label;
    }

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
        this.inputBox.ignoreFocusOut = true;
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
        this.disposables.push(this.inputBox.onDidTriggerButton((button: QuickInputButton) => {
            if (button === openFolderButton) {
                this.handleDialog();
            }
            if (this.onDidTriggerButtonListener) {
                this.onDidTriggerButtonListener(button);
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

        if (this.getValue() !== '' && !this.folderExists()) {
            this.inputBox.validationMessage = 'The folder you have entered does not exist.';
            return false;
        }

        if (this.getValue() !== '' && !this.pathIsFolder()) {
            this.inputBox.validationMessage = 'The path you have entered is not a folder.';
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
            this.inputBox.buttons = this.step > 1
                ? [backButton, openFolderButton]
                : [openFolderButton];
        }
    }

    private async handleDialog(): Promise<void> {
        try {
            const uris = await window.showOpenDialog({
                canSelectMany: false,
                canSelectFiles: false,
                canSelectFolders: true,
                title: this.dialogTitle,
                openLabel: this.dialogOpenLabel,
            });
            if (typeof uris !== 'undefined') {
                const [{ fsPath }] = uris;
                this.setValue(fsPath);
            }
        } catch (error) { }
        this.show();
    }

    private folderExists(): boolean {
        return existsSync(this.value);
    }

    private pathIsFolder(): boolean {
        return lstatSync(this.value).isDirectory(); 
    }
}
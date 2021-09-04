import { QuickInputButton, QuickInputButtons, Disposable, window, QuickPick, QuickPickItem } from "vscode";
import InputStep from "./InputStep";

export type QuickPickItemWithId = QuickPickItem & { id: string };

export default class QuickPickInputStep implements InputStep {

    private quickPick?: QuickPick<QuickPickItem>;
    private items: QuickPickItemWithId[] = [];
    private title = '';
    private step = 1;
    private totalSteps = 1;
    private placeholder = '';
    private value: string[] = [];
    private onChangeListener?: Function;
    private onDidAcceptListener?: Function;
    private onDidTriggerButtonListener?: (e: QuickInputButton) => any;
    private disposables: Disposable[] = [];

    setItems(items: QuickPickItemWithId[]) {
        this.items = items;
        if (this.quickPick) {
            this.quickPick.items = items;
        }
    }

    setTitle(title: string): void {
        this.title = title;
        if (this.quickPick) {
            this.quickPick.title = title;
        }
    }
    setStep(step: number): void {
        this.step = step;
        if (this.quickPick) {
            this.quickPick.step = this.totalSteps > 1 ? step : undefined;
            this.setInputButtons();
        }
    }
    setTotalSteps(stepCount: number): void {
        this.totalSteps = stepCount;
        if (this.quickPick) {
            this.quickPick.totalSteps = stepCount > 1 ? stepCount : undefined;
        }
    }
    setPlaceholder(placeholder: string): void {
        this.placeholder = placeholder;
        if (this.quickPick) {
            this.quickPick.placeholder = placeholder;
        }
    }

    setDescription(description: string): void {
        throw new Error("Method not implemented.");
    }

    getValue() {
        return this.value;
    }

    show(): void {
        if (this.quickPick) {
            this.quickPick.hide();
        }
        this.quickPick = window.createQuickPick();
        this.quickPick.show();
        this.quickPick.title = this.title;
        if (this.totalSteps > 1) {
            this.quickPick.step = this.step;
            this.quickPick.totalSteps = this.totalSteps;
        }
        this.updateSelectedItems();
        this.quickPick.placeholder = this.placeholder;
        this.quickPick.items = this.items;
        this.disposables.push(this.quickPick.onDidChangeValue((e: string) => {
            if (this.quickPick) {
                this.value = this.quickPick.selectedItems.map(item => (item as QuickPickItemWithId).id);
            }
            if (this.onChangeListener) {
                this.onChangeListener();
            }
        }));
        this.disposables.push(this.quickPick.onDidAccept((e: void) => {
            if (this.onDidAcceptListener) {
                this.onDidAcceptListener();
            }
        }));
        this.disposables.push(this.quickPick.onDidTriggerButton((e: QuickInputButton) => {
            if (this.onDidTriggerButtonListener) {
                this.onDidTriggerButtonListener(e);
            }
        }));
        this.setInputButtons();
    }
    hide(): void {
        this.quickPick?.dispose();
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
        return true;
    }

    setValue(value: string[]): void {
        this.value = value;
        this.updateSelectedItems();
    }

    clearValue(): void {
        this.setValue([]);
    }

    private setInputButtons() {
        if (this.quickPick) {
            this.quickPick.buttons = this.step > 1 ? [QuickInputButtons.Back] : [];
        }
    }

    private updateSelectedItems() {
        if (!this.quickPick) {
            return;
        }
        const items: QuickPickItemWithId[] = this.value
            .map(value => {
                return this.items.find(({ id }) => id === value);
            })
            .filter(item => typeof item !== 'undefined')
            .map(item => item as QuickPickItemWithId);
        this.quickPick.selectedItems = items;
    }
}
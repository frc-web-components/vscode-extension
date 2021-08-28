import { QuickInputButton, Disposable } from "vscode";

export default interface InputStep {
    setTitle(title: string): void;
    setStep(step: number): void;
    setTotalSteps(stepCount: number): void;
    setPlaceholder(placeholder: string): void;
    setDescription(description: string): void;
    setRequired(): void;
    getValue(): any;
    show(): void;
    hide(): void;
    onChange(listener: Function): void;
    onDidTriggerButton(listener: (e: QuickInputButton) => any): void;
    validate(): boolean;
    setValue(value: any): void;
    clearValue(): void;
};
import InputButton from './InputButton';

export default interface InputStep {
    setTitle(title: string): void;
    setStep(step: number): void;
    setButtons(backButton: InputButton, forwardButton: InputButton): void;
    setPlaceholder(placeholder: string): void;
    setDescription(description: string): void;
    setRequired(): void;
    getValue(): any;
    show(): void;
    hide(): void;
    addChangeListener(listener: Function): void;
    isValid(): boolean;
};
import { ThemeIcon, QuickInputButtons } from "vscode";
import InputButton from "./InputButton";

export const backButton = QuickInputButtons.Back;

export const openFolderButton = new InputButton(
    new ThemeIcon('explorer-view-icon'), 
    'Open Folder'
);
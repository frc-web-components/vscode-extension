import * as vscode from "vscode";
import CustomWebview from "./CustomWebview";

export default class CustomWebviewView implements vscode.WebviewViewProvider {

    private readonly _customWebview: CustomWebview;

    constructor(customWebview: CustomWebview) { 
        this._customWebview = customWebview;
    }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._customWebview.setWebview(webviewView.webview);
    }
}
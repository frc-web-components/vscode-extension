import * as vscode from "vscode";
import CustomWebview from "./CustomWebview";
import IWebview from "./IWebview";

export default abstract class CustomWebviewView implements vscode.WebviewViewProvider, IWebview {

    public abstract readonly scriptName : string;

    private readonly _customWebview: CustomWebview;
    private readonly _extensionUri : vscode.Uri;
    private _webview: vscode.Webview | null = null;

    public constructor(extensionUri : vscode.Uri) {
        this._extensionUri = extensionUri;
        this._customWebview = new CustomWebview(this);
    }

    public getExtensionUri(): vscode.Uri {
        return this._extensionUri;
    }

    public abstract onDidReceiveMessage(message : any) : any;

    public getWebview(): vscode.Webview | null {
        return this._webview;
    }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._webview = webviewView.webview;
        webviewView.webview.options = this._customWebview.getOptions();
        this._customWebview.setWebview(webviewView.webview);
    }
}
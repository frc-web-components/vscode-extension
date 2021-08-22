import * as vscode from "vscode";
import CustomWebview from "./CustomWebview";
import IWebview from "./IWebview";

export default abstract class CustomWebviewPanel implements IWebview {
    public abstract readonly scriptName : string;
    public abstract readonly title: string = 'View';
    public abstract readonly viewType: string = 'view';

    private readonly _customWebview: CustomWebview;
    private _panel: vscode.WebviewPanel | null = null;
    private _disposables: vscode.Disposable[] = [];
    private readonly _extensionUri : vscode.Uri;

    public constructor(extensionUri : vscode.Uri) {
        this._extensionUri = extensionUri;
        this._customWebview = new CustomWebview(this);
    }

    public getExtensionUri(): vscode.Uri {
        return this._extensionUri;
    }

    public abstract onCommand(command: string, data: any) : any;


    public getWebview(): vscode.Webview | null {
        return this._panel?.webview || null;
    }

    public postCommand(command: string, data: any): void {
        this.getWebview()?.postMessage({ command, data });
    }

    public open(): void {
        if (!this._panel) {
            this._create();
        } else {
            this._panel.reveal();
        }
    }

    public close(): void {
        this._panel?.dispose();
        this._panel = null;
        this._customWebview.dispose();
        this._disposables.forEach(disposable => disposable.dispose());
        this._disposables = [];
    }

    private _create(): void {
        this._panel = vscode.window.createWebviewPanel(
            this.viewType,
            this.title,
            vscode.ViewColumn.One,
            this._customWebview.getOptions()
        );

        this._customWebview.setWebview(this._panel.webview);
        this._panel.onDidDispose(() => this.close(), null, this._disposables);
    }
}

import * as vscode from "vscode";
import CustomWebview from "./CustomWebview";

export default class CustomWebviewPanel {
    public readonly viewType: string;
    public readonly title: string;
    private readonly _customWebview: CustomWebview;

    private _panel: vscode.WebviewPanel | null = null;
    private _disposables: vscode.Disposable[] = [];

    constructor(customWebview: CustomWebview, viewType: string = 'view', title: string = 'View') {
        this._customWebview = customWebview;
        this.viewType = viewType;
        this.title = title;
    }

    private _create(): void {
        this._panel = vscode.window.createWebviewPanel(
            this.viewType,
            this.title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(this._customWebview.getExtensionUri(), "webviews/lib")]
            }
        );

        this._customWebview.setWebview(this._panel.webview);
        this._panel.onDidDispose(() => this.close(), null, this._disposables);
    }

    public getWebview(): vscode.Webview | undefined {
        return this._panel?.webview;
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
}

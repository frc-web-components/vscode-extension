import * as vscode from "vscode";

export default class Webview {
    public readonly viewType: string;
    public readonly title: string;

    private readonly _extensionUri: vscode.Uri;
    private _panel: vscode.WebviewPanel | null = null;
    private _disposables: vscode.Disposable[] = [];

    constructor(extensionUri: vscode.Uri, viewType: string = 'view', title: string = 'View') {
        this._extensionUri = extensionUri;
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
                localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, "webviews/lib")]
            }
        );

        this._panel.webview.html = this.getWebviewContent();

        this._panel.onDidDispose(() => this.close(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message) {

                }
            },
            undefined,
            this._disposables
        );
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
        this._disposables.forEach(disposable => disposable.dispose());
        this._disposables = [];
    }

    private getWebviewContent(): string {

        const appUrl = this._panel?.webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "webviews/lib", "app.js")
        );


        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Config View</title>
                <meta 
                    http-equiv="Content-Security-Policy"
                    content="default-src 'none'; img-src https:; script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:; style-src vscode-resource: 'unsafe-inline';"
                >
                <script>
                    window.acquireVsCodeApi = acquireVsCodeApi;
                </script>
            </head>
            <body>
                <div id="root"></div>
                <script type="module" src="${appUrl}"></script>
            </body>
            </html>
        `;
    }
}
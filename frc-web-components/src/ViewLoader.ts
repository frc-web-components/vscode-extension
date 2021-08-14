import * as vscode from "vscode";

export default class ViewLoader {
    public static readonly viewType = "hello-world";
    private readonly _panel: vscode.WebviewPanel | undefined;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    constructor(extensionUri: vscode.Uri, viewType: string = 'view', title: string = 'View') {
        this._extensionUri = extensionUri;
        this._panel = vscode.window.createWebviewPanel(
            viewType,
            title,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, "src/webviews")]
            }
        );

        this._panel.webview.html = this.getWebviewContent();

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message) {

                }
            },
            undefined,
            this._disposables
        );
    }

    private getWebviewContent(): string {

        const appUrl = this._panel?.webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "src/webviews/pages", "app.js")
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
                <script src="${appUrl}"></script>
            </body>
            </html>
        `;
    }
}
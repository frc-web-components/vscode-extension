import * as vscode from "vscode";

export default abstract class CustomWebview {

    public readonly abstract scriptName : string;

    private readonly _extensionUri: vscode.Uri;
    private _webview: vscode.Webview | null = null;

    private _panel: vscode.WebviewPanel | null = null;
    private _disposables: vscode.Disposable[] = [];

    public constructor(extensionUri: vscode.Uri) {
        this._extensionUri = extensionUri;
    }

    public getExtensionUri(): vscode.Uri {
        return this._extensionUri;
    }

    public setWebview(webview: vscode.Webview) {
        this.dispose();
        this._webview = webview;
        this._webview.html = this.getWebviewContent();
        this._webview.onDidReceiveMessage(
            message => {
                return this.onDidReceiveMessage(message);
            },
            undefined,
            this._disposables
        );
    }

    protected abstract onDidReceiveMessage(message : any) : any;

    public dispose(): void {
        this._webview = null;
        this._disposables.forEach(disposable => disposable.dispose());
        this._disposables = [];
    }

    public getWebview(): vscode.Webview | null {
        return this._webview;
    }

    public getOptions() {
        return {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.getExtensionUri(), "webviews/dist")]
        };
    }

    private getWebviewContent(): string {

        const scriptUrl = this._webview?.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "webviews/dist", this.scriptName)
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
                    content="default-src 'none'; img-src https:; script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:; style-src ${this._panel?.webview.cspSource} 'unsafe-inline';"
                >
                <script>
                    window.acquireVsCodeApi = acquireVsCodeApi;
                </script>
            </head>
            <body>
                <div id="root"></div>
                <script type="module" src="${scriptUrl}"></script>
            </body>
            </html>
        `;
    }
}

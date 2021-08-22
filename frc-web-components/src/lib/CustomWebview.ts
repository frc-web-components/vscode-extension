import * as vscode from "vscode";
import IWebview from "./IWebview";

export default class CustomWebview {

    private readonly _webivewInterface: IWebview;
    private _webview: vscode.Webview | null = null;

    private _panel: vscode.WebviewPanel | null = null;
    private _disposables: vscode.Disposable[] = [];

    public constructor(_webivewInterface: IWebview) {
        this._webivewInterface = _webivewInterface;
    }

    public setWebview(webview : vscode.Webview) {
        this.dispose();
        this._webview = webview;
        this._webview.html = this._getWebviewContent();
        this._webview.onDidReceiveMessage(
            message => {
                return this._webivewInterface.onDidReceiveMessage(message);
            },
            undefined,
            this._disposables
        );
    }

    public dispose(): void {
        this._webview = null;
        this._disposables.forEach(disposable => disposable.dispose());
        this._disposables = [];
    }

    public getOptions() {
        return {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(
                    this._webivewInterface.getExtensionUri(), "webviews/dist"
                )
            ]
        };
    }

    private _getWebviewContent(): string {

        const scriptUrl = this._webview?.asWebviewUri(
            vscode.Uri.joinPath(
                this._webivewInterface.getExtensionUri(), 
                "webviews/dist", 
                this._webivewInterface.scriptName
            )
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

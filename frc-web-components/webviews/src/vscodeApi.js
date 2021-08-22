const vscode = window.vscode;

export default vscode;

export const onMessage = listener => {
    window.addEventListener('message', event => {
        listener(event.data);
    });
};

export const onCommand = (command, listener) => {
    window.addEventListener('message', event => {
        if (event.data.command === command) {
            listener(event.data.data);
        }
    });
};

export const postCommand = (command, data) => {
    vscode.postMessage({ command, data });
};
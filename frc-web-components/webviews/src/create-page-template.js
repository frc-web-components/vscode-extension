import { html, render } from "lit";
import resetCss from './styles/reset.css';
import vscodeCss from './styles/vscode.css';

export default (pageTemplate) => {
    return (...args) => {
        render(
            html`
                <style>${resetCss}</style>
                <style>${vscodeCss}</style>
                ${pageTemplate(...args)}
            `, 
            document.getElementById('root')
        );
    };
};
import { html, render } from "lit";
import resetCss from '../styles/reset.css';
import vscodeCss from '../styles/vscode.css';

const template = () => html`
    <style>${resetCss}</style>
    <style>${vscodeCss}</style>
    <p>Hellod woorld!?</p>
    <button>Button</button>
`;

render(template(), document.getElementById('root'));

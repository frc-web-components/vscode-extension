import { html, render } from "lit";



const template = () => html`
    <p>Hello world!</p>
`;

render(template(), document.getElementById('root'));

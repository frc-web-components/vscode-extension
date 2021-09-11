import { html } from "lit";
import createPageTemplate from '../create-page-template';
import { onCommand, postCommand } from "../vscodeApi";

const createNewDashboard = () => postCommand('createNewDashboard');

const renderPage = createPageTemplate(() => {
    return html`
        <style>
            button {
                margin: 0 10px;
            }
        </style>
        <p>You have not yet opened a dashboard. Click here to open up an existing dashboard project:</p>
        <button>Open Dashboard</button>
        <p>Or click here to create a new dashboard project:</p>
        <button @click="${createNewDashboard}">Create New Dashboard</button>
    `;
});

renderPage();

onCommand('someCommand', data => {

});

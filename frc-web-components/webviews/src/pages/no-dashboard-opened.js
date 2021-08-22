import { html } from "lit";
import createPageTemplate from '../create-page-template';

const renderPage = createPageTemplate(() => html`
    <style>
        button {
            margin: 0 10px;
        }
    </style>
    <p>You have not yet opened a dashboard. Click here to open up an existing dashboard project:</p>
    <button>Open Dashboard</button>
    <p>Or click here to create a new dashboard project:</p>
    <button>Create New Dashboard</button>
`);


renderPage();

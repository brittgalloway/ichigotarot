import { markup } from './star-template.generated.js';

const template = document.createElement('template');
template.innerHTML = markup;

class StarTemplate  extends HTMLElement {
    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('star-template', StarTemplate);
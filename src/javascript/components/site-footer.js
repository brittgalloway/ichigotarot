import { markup } from './site-footer.generated.js';

const template = document.createElement('template');
template.innerHTML = markup;

class SiteFooter  extends HTMLElement {
    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('site-footer', SiteFooter);
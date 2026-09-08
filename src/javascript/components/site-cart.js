import { markup } from './site-cart.generated.js';

const template = document.createElement('template');
template.innerHTML = markup;

class SiteCart  extends HTMLElement {
    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('site-cart', SiteCart);
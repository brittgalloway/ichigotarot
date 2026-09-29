import { markup } from './site-nav.generated.js';

const template = document.createElement('template');
template.innerHTML = markup;

class SiteNav  extends HTMLElement {
    connectedCallback() {

        this.appendChild(template.content.cloneNode(true));

        const nav = this.querySelector('#main-nav');

        if (!nav) return;

        nav.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                nav.hidePopover();
            }
        })
    }
}

customElements.define('site-nav', SiteNav);
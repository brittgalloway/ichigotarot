import { markup } from './site-cart.generated.js';

const template = document.createElement('template');
template.innerHTML = markup;

class SiteCart  extends HTMLElement {
    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));

        this.dialog = this.querySelector('#site-cart-dialog');
        if (!this.dialog) return;

        const closeBtn = this.querySelector('#site-cart-close');
        closeBtn?.addEventListener('click', () => this.close());

        this.dialog.addEventListener('click', (e) => {
            if (e.target === this.dialog) {
                this.close();
            }
        });
    }
    open() {
        this.dialog?.showModal();
    }
    close() {
        this.dialog?.close();
    }
}

customElements.define('site-cart', SiteCart);
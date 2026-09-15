document.addEventListener('alpine:init', () => {
    Alpine.store('cart', {
        items: [],

        init() {
            const saved = localStorage.getItem('ichigotarot-cart');
            if (!saved) return;

            try {
                this.items = JSON.parse(saved);
            } catch (err) {
                console.error(`Failed to parse saved cart, starting empty: ${err}`);
            }
        },

        persist() {
            localStorage.setItem('ichigotarot-cart', JSON.stringify(this.items));
        },

        addItem({slug, title, variantLabel, price, img}) {
            const existing = this.items.find(
                (item) => item.slug === slug && item.variantLabel === variantLabel
            );

            if (existing) {
                existing.quantity += 1;
            } else {
                this.items.push({ slug, title, variantLabel, price, img, quantity: 1});
            }

            this.persist();
        },

        removeItem(slug, variantLabel) {
            this.items = this.items.filter(
                (item) => !(item.slug === slug && item.variantLabel === variantLabel)
            );
            this.persist();
        },

        updateQuantity(slug, variantLabel, quantity) {
            if (quantity <= 0) {
                this.removeItem(slug, variantLabel);
                return;
            }

            const item = this.items.find(
                (item) => item.slug === slug && item.variantLabel === variantLabel
            );
            if (!item) return;

            item.quantity = quantity;
            this.persist();
        },

        get count() {
            return this.items.reduce((sum, item) => sum + item.quantity, 0);
        },

        get subtotal() {
            return this.items.reduce((sum, item) => {
                const price = parseFloat(item.price);
                return sum + (isNaN(price) ? 0 : price * item.quantity);
            }, 0 );
        }

    })
})
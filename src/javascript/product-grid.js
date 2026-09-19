document.addEventListener('alpine:init', () => {
    Alpine.data('productGrid', (options = {}) => ({
        products: [],
        loading: true,
        error: false,

        async init() {
            try {
                
                const res = await fetch('./src/data/products.json');
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
                const all = await res.json();

                this.products = options.collection
                    ? all.filter((p) => p.collection === options.collection)
                    : all;
            } catch (err) {
                console.error('Failed to load products:', err);
                this.error = true;
            } finally {
                this.loading = false;
            }
        },
        lowestPrice(product) {
            const prices = product.variants
            .map((v) => parseFloat(v.price))
            .filter((n) => !isNaN(n));

            return prices.length ? Math.min(...prices) : null;
        },

        displayPrice(product) {
            const price = this.lowestPrice(product);
            if (price === null) return '';
            return product.variants.length > 1 ? `From $${price}` : `$${price}`;
        }
    }));
});
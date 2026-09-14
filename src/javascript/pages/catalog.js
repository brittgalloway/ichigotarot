document.addEventListener('alpine:init', () => {
    Alpine.data('catalogPage', () => ({
        products: [],
        loading: true,
        error: false,

        async init() {
            try {
                
                const res = await fetch('./src/data/products.json');
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
                this.products = await res.json();
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
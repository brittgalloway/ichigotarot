document.addEventListener('alpine:init', () => {
    Alpine.data('productPage', () => ({
        product: null,
        selectedVariant: null,
        loading: true,
        error: false,

        async init() {
            const slug = new URLSearchParams(window.location.search).get('slug');

            try {
                const res = await fetch('./src/data/products.json');
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

                const products = await res.json();
                this.product = products.find((p) => p.slug === slug) || null;

                if (this.product) {
                    this.selectedVariant = this.product.selectedVariant;
                    document.title = `${this.product.title} | Ichigo Tarot`;
                } else {
                    this.error = true;
                }
            } catch (err) {
                console.error(`Failed to load product: ${err}`);
                this.error = true;
            } finally {
                this.loading = false;
            }
        },
        selectedVariant(variant) {
            this.selectedVariant = variant;
        },
        get displayImage() {
            if (!this.product) return '';
            return (this.selectedVariant && this.selectedVariant.img) || this.product.img;
        },
        get displayPrice() {
            console.log(this.selectedVariant)
            if (!this.selectedVariant || this.selectedVariant.price === '') {
                return 'Sold Out'
            }
            return `$${this.selectedVariant.price}`;
        },
        // TODO: addToCart
        addToCart() {
            console.log('add to cart')
        }
    }))
})
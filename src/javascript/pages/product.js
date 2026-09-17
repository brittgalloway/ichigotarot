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
                    this.selectedVariant = this.product.variants[0];
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
        selectVariant(variant) {
            this.selectedVariant = variant;
        },
        get displayImage() {
            if (!this.product) return '';
            return (this.selectedVariant && this.selectedVariant.img) || this.product.img;
        },
        get displayPrice() {
            if (!this.selectedVariant || this.selectedVariant.price === '') {
                return 'Sold Out'
            }
            return `$${this.selectedVariant.price}`;
        },
        
        addToCart() {
            if (!this.product || !this.selectedVariant) return;

            Alpine.store('cart').addItem({
                slug: this.product.slug,
                title: this.product.title,
                variantLabel: this.selectedVariant.label,
                price: this.selectedVariant.price,
                img: this.displayImage
            });

            document.querySelector('site-cart')?.open()
        }
    }))
})
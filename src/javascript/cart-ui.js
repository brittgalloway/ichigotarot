document.addEventListener('alpine:init', () => {
    Alpine.data('cartUi', () => ({
        checkingOut: false,
        error:null,

        async checkout() {
            const items = Alpine.store('cart').items.map((item) => ({
                slug: item.slug,
                variantLabel: item.variantLabel,
                quantity: item.quantity
            }));

            if (items.length === 0) return;

            this.checkingOut = true;
            this.error = null;

            try {
                const res = await fetch('/api/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        items,
                        cancelUrl: window.location.href
                    })
                });

                if (!res.ok) throw new Error(`Checkout failed: ${res.status}`);

                const { url } = await res.json();
                if (!url) throw new Error('No checkout URL returned');
                window.location.href = url;
            } catch (err) {
                console.error(`Checkout error: ${err}`);
                this.error = 'Something went wrong starting the checkout. Please try agian.'
                this.checkingOut = false;
            }
        }
    }))
})
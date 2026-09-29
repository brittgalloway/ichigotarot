document.addEventListener('alpine:init', () => {
    Alpine.data('siteFooter', () => ({
        collections: [],

        async init() {

            try {
                const res = await fetch('./src/data/products.json');

                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

                const products = await res.json();
                const names = products.map((p) => p.collection).filter((c) => typeof c === 'string' && c.trim() !== '');

                this.collections = [...new Set(names)].sort();
            } catch (err) {
                console.error(`Failed to load collections: ${err}`);
            }
        }
    }))
})
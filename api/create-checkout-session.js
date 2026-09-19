const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe only allows 10 lookup_keys per prices.list() call
const LOOKUP_KEY_BATCH_SIZE = 10;

function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

const WEIGHT_INCREMENT_OZ = 8;
const DEFAULT_ITEM_WEIGHT_OZ = WEIGHT_INCREMENT_OZ;

const SHIPPING_METHODS = [
    {
        key: 'ground',
        displayName: 'Ground Shipping',
        baseCents: 1200,
        perIncrementCents: 200,
        estimate: {
            minimum: {unit: 'business_day', value: 5},
            maximum: {unit: 'business_day', value: 7}
        }
    },
    {
        key: 'priority',
        displayName: 'Priority Shipping',
        baseCents: 1700,
        perIncrementCents: 200,
        estimate: {
            minimum: {unit: 'business_day', value: 2},
            maximum: {unit: 'business_day', value: 4}
        }
    },
];

function buildShippingOptions(totalWeightOz) {
    const extraIncrements = Math.max(0, Math.ceil((totalWeightOz - WEIGHT_INCREMENT_OZ) / WEIGHT_INCREMENT_OZ));
    return SHIPPING_METHODS.map((method) => {
        const amount = method.baseCents + method.perIncrementCents * extraIncrements;

        return {
            shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount, currency: 'usd'},
                display_name: method.displayName,
                delivery_estimate: {
                    minimum: method.estimate.minimum,
                    maximum: method.estimate.maximum
                }
            }
        };
    });
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed'});
    }

    try {
        const { items, cancelUrl } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');
        const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

        const resolvedItems = items.map(({ slug, variantLabel, quantity}) => {
            const product = products.find((p) => p.slug === slug);
            if (!product) throw new Error(`Unknown product: ${slug}`);

            const variant = product.variants.find((v) => v.label === variantLabel);

            if (!variant) throw new Error(`Unknown variant "${variantLabel}" for ${slug}`);

            if (!variant.stripeLookupKey) {
                throw new Error(`No Stripe lookup key set for ${slug} (${variantLabel})`);
            }

            const weightOz = typeof variant.weightOz === 'number' ? variant.weightOz : null;
            return {
                slug,
                variantLabel,
                lookupKey: variant.stripeLookupKey,
                quantity: Math.max(1, parseInt(quantity, 10) || 1),
                weightOz
            };
    });

    const lookupKeys = [...new Set(resolvedItems.map((i) => i.lookupKey))];
    const priceByLookupKey = new Map();

    for (const keyChunk of chunk(lookupKeys, LOOKUP_KEY_BATCH_SIZE)) {
        const {data: prices} = await stripe.prices.list({
            lookup_keys: keyChunk,
            active: true
        });

        for (const price of prices) {
            priceByLookupKey.set(price.lookup_key, price);
        }
    }
    const line_items = resolvedItems.map(({ slug, variantLabel, lookupKey, quantity}) => {
        const price = priceByLookupKey.get(lookupKey);
        if (!price) {
            throw new Error(`No active Stripe price found for lookup key "${lookupKey}" (${slug}, ${variantLabel})`);
        }

        return { price: price.id, quantity };
    });
    const totalWeightOz = resolvedItems.reduce(
        (sum, item) => sum + item.quantity * (item.weightOz ?? DEFAULT_ITEM_WEIGHT_OZ),
        0
    )

    const shipping_options = buildShippingOptions(totalWeightOz);

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const safeCancelUrl = (cancelUrl && cancelUrl.startsWith(origin))
        ? cancelUrl
        : `${origin}/catalog.html`;

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items,
            shipping_address_collection: {
                allowed_countries: ['US']
            },
            shipping_options,
            success_url: `${origin}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: safeCancelUrl,
            invoice_creation: { enabled: true }
        });

        return res.status(200).json({ url: session.url });
    } catch (err) {
        console.error(`Stripe checkout session error: ${err}`);
        return res.status(500).json({ error: 'Unable to start checkout'});
    }
};
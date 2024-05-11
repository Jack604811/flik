import { ProductCard } from "@/components/blocks/cards/product-card";
import { OneTimeCheckoutButton, RecurringCheckoutButton } from "@/components/store/checkout-button";

export default function Pricing() {
    return (
        <section className="bg-accent text-accent-foreground py-6 px-4 space-y-6 xl:py-14 flex flex-col items-center">

            <h1 className="mt-6 text-3xl font-bold   text-center">
                Pricing that Fits
            </h1>

            <ProductCard
            price="15"
            features={[]}
            title="Basic"
            description="Something"
            purchaseButton={
                <RecurringCheckoutButton priceId="price_1PEvbMAJWVpSAunXU1FgJNJx">Subscribe</RecurringCheckoutButton>
            }
            />

           


        </section>
    );
}
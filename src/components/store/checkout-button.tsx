import Link from "next/link";
import { Button } from "@/components/ui/button";

export function RecurringCheckoutButton({ priceId, children }: { priceId: string, children: React.ReactNode }) {
    return (
        <Link className="mt-3 block" href={`/subscribe/${priceId}?mode=subscription`} >
            <Button className="w-full lg:h-14 lg:text-lg">
                {children}
            </Button>
        </Link>
    )
}

export function OneTimeCheckoutButton({ priceId, productId, children }: { priceId: string, productId: string, children?: React.ReactNode }) {
    return (
        <Link className="mt-3 block" href={`/subscribe/${priceId}?mode=payment&productId=${productId}`} >
            <Button className="w-full lg:h-14 lg:text-lg">
                {children}
            </Button>
        </Link>
    )
}
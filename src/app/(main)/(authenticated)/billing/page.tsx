import { CustomerPortalLink } from "@/components/store/customer-portal-link";

export default function Page() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">Billing</h3>
            <div className="text-sm text-muted-foreground">
              <p>This is a billing page, all information about client billing show up here</p>
              <CustomerPortalLink className="p-3 border rounded-md bg-black text-secondary">Check Billing</CustomerPortalLink>
            </div>
          </div>
        </div>
      );
}
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTotalCardsMetric } from "@/server/actions/dashboard.action";
import { useQuery } from "@tanstack/react-query";
import { useDateRange } from "./date-range-context"; // Import DateRange context
import { DollarSign, User, CreditCard, Activity } from "lucide-react"; // Import Lucide icons

// Number formatter for currency with thousand separators
const formatNumber = (number: number) => {
  return new Intl.NumberFormat("de-DE").format(number);
};

type Params = { workspaceId?: string };

export function TopCards({ workspaceId }: Params) {
  // Get the startDate and endDate from the date range context (like in Sales component)
  const { startDate, endDate } = useDateRange();

  // React Query to fetch data using the validated dates
  const { data, isLoading, error } = useQuery({
    queryKey: ["top-cards-metric", workspaceId, startDate, endDate],
    queryFn: async () => getTotalCardsMetric(workspaceId ?? null, startDate, endDate),
    enabled: !!startDate && !!endDate,
    initialData: { totalBookings: 0, totalExtraSales: 0, totalRevenue: 0, outstanding: 0 },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" /> 
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${formatNumber(Math.round(data?.totalRevenue ?? 0))}
          </div>
          {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" /> {/* Lucide User Icon */}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold"> +{formatNumber(data?.totalBookings ?? 0)}</div>
          {/* <p className="text-xs text-muted-foreground">+18.1% from last month</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Extras sales</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" /> 
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${formatNumber(Math.round(data?.totalExtraSales ?? 0))} 
          </div>
          {/* <p className="text-xs text-muted-foreground">+19% from last month</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" /> 
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${formatNumber(Math.round(data?.outstanding ?? 0))} 
          </div>
          {/* <p className="text-xs text-muted-foreground">+201 since last hour</p> */}
        </CardContent>
      </Card>
    </div>
  );
}

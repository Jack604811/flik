import { Metadata } from "next"

import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { getTransactions } from "@/server/actions/booking.action"
import { getCurrentUser } from "@/server/auth"

export const metadata: Metadata = {
  title: "Transactions",
  description: "A list of your transactions",
}


export default async function TaskPage() {
  const currentUser = await getCurrentUser()
  const transactions = await getTransactions(currentUser!.id) as any

  return (
    <>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your bookings&apos; transactions so far!
            </p>
          </div>
        </div>
        <DataTable data={transactions} columns={columns} />
      </div>
    </>
  )
}

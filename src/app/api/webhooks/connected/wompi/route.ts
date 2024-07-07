import { WOMPI_CENT_MULTIPLIER } from "@/app_settings";
import { handleWompiBookingPaymentEvent } from "@/server/actions/booking.action";
import _ from "lodash";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const wompiEvent = await req.json();
    if (
      wompiEvent?.event === "transaction.updated" &&
      wompiEvent?.data?.transaction?.reference &&
      wompiEvent?.data?.transaction?.status === "APPROVED"
    ) {
      // Update booking status and add transaction to the booking
      await handleWompiBookingPaymentEvent(
        wompiEvent?.data?.transaction?.reference!,
        {
          amount: _.round(wompiEvent?.data?.transaction?.amount_in_cents/ WOMPI_CENT_MULTIPLIER,2) ,
          paymentDate: moment(
            wompiEvent?.data?.transaction?.created_at
          ).toDate(),
        }
      );
    }
  } catch (error: any) {
    console.log(error.message)
  }

  return NextResponse.json({});
};
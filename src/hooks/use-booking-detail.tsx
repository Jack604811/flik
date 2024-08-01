import { Button } from "@/components/ui/button";
import { Booking } from "@/schemas/booking.schema";
import { useEffect } from "react";
import { create } from "zustand";

type Store = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  needUpdate?: string;
  setNeedUpdate: (nu: string | undefined, booking?: Booking) => void;
  booking?: Booking;
  onBookingDetail: (isOpen: boolean, booking?: Booking) => void;
};

export const useBookingDetail = create<Store>((set) => {
  return {
    isOpen: false,
    onOpenChange: (isOpen) => set({ isOpen }),
    setNeedUpdate: (needUpdate, booking) =>
      set({ needUpdate, ...(booking ? { booking } : {}) }),
    onBookingDetail: (isOpen, booking) => set({ isOpen, booking }),
  };
});

type Props = {
  children: React.ReactNode;
  booking?: Booking;
};

export const BookingDetailButton = ({ children, booking }: Props) => {
  const onBookingDetail = useBookingDetail((state) => state.onBookingDetail);
  const {needUpdate, setNeedUpdate} = useBookingDetail((state) => ({needUpdate: state.needUpdate, setNeedUpdate: state.setNeedUpdate}));
  
  useEffect(() => {
    if(needUpdate === booking?.id) setNeedUpdate(undefined, booking);
  }, [needUpdate])

  return (
    <Button
      variant="ghost"
      // className="pr-24 pl-0 text-left hover:bg-transparent"
      className="p-0 pl-0 text-left hover:bg-transparent"
      onClick={() => onBookingDetail(true, booking)}
    >
      {children}
    </Button>
  );
};

import { Button } from "@/components/ui/button";
import { Booking } from "@/schemas/booking.schema";
import { create } from "zustand";

type Store = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  booking?: Booking;
  onBookingDetail: (isOpen: boolean, booking?: Booking) => void
};

export const useBookingDetail = create<Store>((set) => {
  return {
    isOpen: false,
    onOpenChange: (isOpen) => set({ isOpen }),
    onBookingDetail: (isOpen, booking) => set({isOpen, booking})
  };
});

type Props = {
  children: React.ReactNode;
  booking?: Booking;
};

export const BookingDetailButton = ({children, booking}: Props) => {
  const onBookingDetail = useBookingDetail(state => state.onBookingDetail);
  return <Button variant="ghost" className="p-0" onClick={() => onBookingDetail(true, booking)}>{children}</Button>
}
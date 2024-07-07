import moment from "moment";
import { DateRange } from "react-day-picker";

export type WORKING_HOUR_TYPE = {
  day: string;
  price: number;
  openTime: string;
  closeTime: string;
};

export const getDatesArray = (
  selectedDate: Date | DateRange | undefined
): Date[] => {
  if (!selectedDate) return [];

  if ("from" in selectedDate && "to" in selectedDate) {
    const startDate = moment(selectedDate.from);
    const endDate = moment(selectedDate.to);
    const days: Date[] = [];
    for (
      let date = startDate;
      date.isSameOrBefore(endDate);
      date.add(1, "day")
    ) {
      days.push(date.toDate());
    }
    return days;
  }

  return [selectedDate as Date]; // If it's a single date
};

export const getPriceForDay = (
  day: string,
  workingHours: WORKING_HOUR_TYPE[]
): number => {
  const workingHour = workingHours?.find((wh) => wh.day === day);
  return workingHour ? workingHour.price : 0;
};

export const calculateSubtotal = (
  selectedDate: Date | DateRange | undefined,
  workingHours: WORKING_HOUR_TYPE[]
): number => {
  const days = getDatesArray(selectedDate);
  return days.reduce((total, date) => {
    const dayOfWeek = moment(date).format("dddd");
    return total + getPriceForDay(dayOfWeek, workingHours);
  }, 0);
};

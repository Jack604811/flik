import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Category, Extras, ExtrasImages, SubCategory } from "@prisma/client";
import moment from "moment";
import { DateRange } from "react-day-picker";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: "no-store" });

  return response.json();
}

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

  // Exclude the last day only if it's not a single day booking
  const isSingleDayBooking = days.length === 1;

  // If not a single day booking, exclude the last day
  const daysToCharge = isSingleDayBooking ? days : days.slice(0, -1);

  return daysToCharge.reduce((total, date) => {
    const dayOfWeek = moment(date).format("dddd");
    return total + getPriceForDay(dayOfWeek, workingHours);
  }, 0);
};

export function categorizeExtras(extras?: (Extras&{category?: Category, subCategory?: SubCategory, images: ExtrasImages[]})[]) {
  const categorized: Record<
    string,
    Record<string, (Extras&{category?: Category, subCategory?: SubCategory, images: ExtrasImages[]})[]>
  > = {};

  extras?.forEach((extra) => {
    const category = extra?.category?.name ?? "Others";
    const subCategory = extra?.subCategory?.name ?? "Others";

    if (!categorized[category]) {
      categorized[category] = {};
    }

    if (!categorized[category][subCategory]) {
      categorized[category][subCategory] = [];
    }

    categorized[category][subCategory].push(extra);
  });

  return categorized;
}

export const parseDate = (dateString: string | null, fallback: Date = new Date()) => {
  const parsedDate = dateString ? new Date(dateString) : fallback;
  return isNaN(parsedDate.getTime()) ? fallback : parsedDate;
};

export const parseDashboardDates = (startDateString: string|null, endDateString: string|null) => {
  const startDate = startDateString ? moment(startDateString, ["MM/DD/YYYY"]).toDate() : moment().toDate();
  const endDate = endDateString ? moment(endDateString, ["MM/DD/YYYY"]).toDate() : moment().toDate();
  return { startDate, endDate }
}

export const getInitials = (name: string) => {
  if (!name) return '??';
  const splitName = name.split(' ');
  if (splitName.length < 2) return splitName[0].charAt(0).toUpperCase();
  return `${splitName[0].charAt(0).toUpperCase()}${splitName[splitName.length - 1].charAt(0).toUpperCase()}`;
};

export function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
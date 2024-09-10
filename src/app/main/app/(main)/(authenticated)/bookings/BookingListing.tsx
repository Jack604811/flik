"use client";
import React, { useEffect } from 'react'
import { columns } from '@/components/booking/columns';
import { DataTable } from '@/components/booking/data-table';
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '@/server/actions/booking.action';
import supabase from '@/server/helpers/supabase';

function BookingListing({bookings, userId} : {bookings: any, userId: string}) {
    // const {data, refetch} = useQuery({
    //     queryKey: ["bookings"],
    //     queryFn: () => getBookings(userId),
    //     initialData: bookings,
    //     refetchOnMount: false
    // })

    // const channels = supabase.channel('bookings-channel')
    //     .on(
    //         'postgres_changes',
    //         { event: 'INSERT', schema: 'public', table: 'bookings' },
    //         (payload) => {
    //         console.log('Change received!', payload)
    //         }
    //     )
    //     .subscribe()

    // useEffect(() => {
    //     const channels = supabase.channel('bookings-channel')
    //     .on(
    //         'postgres_changes',
    //         { event: 'INSERT', schema: 'public', table: 'Booking' },
    //         (payload) => {
    //         console.log('Change received!', payload)
    //         }
    //     )
    //     .subscribe()
    
    //     return () => {
    //         supabase.removeChannel(channels);
    //     };
    // }, []);


  return (
    <DataTable data={bookings} columns={columns} />
  )
}

export default BookingListing
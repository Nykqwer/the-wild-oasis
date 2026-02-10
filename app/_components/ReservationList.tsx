"use client"

import React, { useOptimistic } from 'react'
import ReservationCard from './ReservationCard'
import { BookingWithCabin } from '../_lib/data-service';
import { deleteBooking } from '../_lib/actions';


interface ReservationListProps {
  bookings: BookingWithCabin[];
}



export default function ReservationList({ bookings }: ReservationListProps) {

     const [optimisticBookings, optimisticDelete] = useOptimistic(
            bookings,
            (curBooking: BookingWithCabin[], bookingId: number) =>
            curBooking.filter((booking) => booking.id !== bookingId)
        );

    async function handleDelete(bookingId: number){
        optimisticDelete(bookingId);
        await deleteBooking(bookingId);
    }

  return (
        <ul className="space-y-6">
          {optimisticBookings.map((booking) => (
            <ReservationCard onDelete={handleDelete} booking={booking} key={booking.id} />
          ))}
        </ul>
  )
}

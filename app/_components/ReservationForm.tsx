"use client";

import { differenceInDays } from "date-fns";
import { useReservation } from "./ReservationContext";
import { BookingData, createBooking } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

type ReservationFormProps = {
  cabin: {
    id: number;
    maxCapacity: number;
    regularPrice: number;
    discount: number;
  };
  user: {
    name?: string | null;
    image?: string | null;
  };
};

function ReservationForm({ cabin, user }: ReservationFormProps) {
  const { maxCapacity, regularPrice, discount, id } = cabin;
  const { range, resetRange } = useReservation();

  const hasDates = Boolean(range.from && range.to);

  const numNights = hasDates
    ? differenceInDays(range.to!, range.from!)
    : 0;

  const cabinPrice = hasDates
    ? numNights * (regularPrice - discount)
    : 0;

  const bookingData: BookingData | null = hasDates
    ? {
        startDate: range.from!,
        endDate: range.to!,
        numNights,
        cabinPrice,
        cabinId: id,
      }
    : null;

  const createBookingWithData = bookingData
    ? createBooking.bind(null, bookingData)
    : null;

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          <img
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image ?? ""}
            alt={user.name ?? "User avatar"}
          />
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          if (!createBookingWithData) return;

          await createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          { !hasDates ? 
          <p className="text-primary-300 text-base">
            Start by selecting dates
          </p>
        
        :<SubmitButton pendingLabel="Reserving..." >Reserve Now</SubmitButton>
     
        }
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;

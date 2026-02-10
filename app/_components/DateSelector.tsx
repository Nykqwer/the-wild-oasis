"use client";

import { differenceInDays, isPast, isSameDay, isWithinInterval } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Cabin } from "../_lib/data-service";
import { useState } from "react";
import { useReservation } from "./ReservationContext";

type DateSelectorProps = {
  cabin: Cabin;
  settings:{
    minBookingLength: number;
    maxBookingLength: number;
  }

  bookedDates: Date[];
}

function isAlreadyBooked(
  range: DateRange | undefined,
  datesArr: Date[]
): boolean {
  if (!range?.from || !range?.to) return false;

  const { from, to } = range; // ✅ TS now knows these are Date

  return datesArr.some((date) =>
    isWithinInterval(date, {
      start: from,
      end: to,
    })
  );
}



function DateSelector({cabin, settings, bookedDates}: DateSelectorProps) {

  const {range, setRange, resetRange} = useReservation();

  const displayRange: DateRange | undefined =
  isAlreadyBooked(range, bookedDates) ? undefined : range;


    const {regularPrice, discount} = cabin;
    const numNights =
    displayRange?.from && displayRange?.to
      ? differenceInDays(displayRange.to, displayRange.from)
      : 0;


  const cabinPrice = numNights * (regularPrice - discount);



  // SETTINGS
  const {minBookingLength, maxBookingLength} = settings;

  return (
    <div className="flex flex-col justify-between">
            <DayPicker
              className="place-self-center pt-12"
              mode="range"
              required
              min={minBookingLength + 1}
              max={maxBookingLength}
              selected={displayRange}
              onSelect={setRange}
              startMonth={new Date()}
              endMonth={new Date(new Date().getFullYear() + 5, 11)}
              disabled={(curDate) => isPast(curDate) || bookedDates.some((date) => isSameDay(date, curDate))}
              captionLayout="dropdown"
              numberOfMonths={2}
             
            />



      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-18">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

          {range?.from || range?.to ? (<button 
            className="border border-primary-800 py-2 px-4 text-sm font-semibold" 
          onClick={resetRange}> Clear </button>    
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;

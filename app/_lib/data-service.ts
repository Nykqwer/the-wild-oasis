import { eachDayOfInterval } from 'date-fns';
import {supabase} from "./supabase";

import { notFound } from 'next/navigation';
import Cabin from '../_components/Cabin';


export type Cabin = {
  id: number
  name: string
  description?: string   // 👈 required
  maxCapacity: number
  regularPrice: number
  discount: number
  image: string
}




export type BookingWithCabin = {
  id: number;
  guestId: number;
  startDate: string;
  endDate: string;
  numNights: number;
  totalPrice: number;
  numGuests: number;
  created_at: string;
  cabinId: number;
  cabins: {
    name: string;
    image: string;
  }; // <-- array
  status: string; 
};



/////////////
// GET

export async function getCabin(id: number) {
  const { data, error } = await supabase
    .from('cabins')
    .select('*')
    .eq('id', id)
    .single();

  // For testing
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export async function getCabinPrice(id: number) {
  const { data, error } = await supabase
    .from('cabins')
    .select('regularPrice, discount')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
  }

  return data;
}

export const getCabins = async (): Promise<Cabin[]> => {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name")

  if (error) {
    console.error(error)
    throw new Error("Cabins could not be loaded")
  }

  return data ?? []
}


// Guests are uniquely identified by their email address
export async function getGuest(email : any) {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('email', email)
    .single();

  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}

export async function getBooking(id : number) {
  const { data, error, count } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(error);
    throw new Error('Booking could not get loaded');
  }

  return data;
}
export async function getBookings(guestId: number) {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      id,
      created_at,
      startDate,
      endDate,
      numNights,
      numGuests,
      totalPrice,
      status,
      guestId,
      cabinId,
      cabins!bookings_cabinId_fkey (
        name,
        image
      )
    `)
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    throw new Error("Bookings could not be loaded");
  }

  if (!data) return [];

  // 🔑 NORMALIZE HERE
  return data.map((booking) => ({
    ...booking,
    cabins: Array.isArray(booking.cabins)
      ? booking.cabins[0]
      : booking.cabins,
  }));
}


export async function getBookedDatesByCabinId(cabinId : number): Promise<Date[]>  {
 let today: Date = new Date()
today.setUTCHours(0, 0, 0, 0)
const todayISO: string = today.toISOString()

  // Getting all bookings
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('cabinId', cabinId)
    .or(`startDate.gte.${todayISO},status.eq.checked-in`);

 

  if (error) {
    console.error(error);
    throw new Error('Bookings could not get loaded');
  }

  // Converting to actual dates to be displayed in the date picker
  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*').single();

  await new Promise((res) => setTimeout(res, 2000));
  if (error) {
    console.error(error);
    throw new Error('Settings could not be loaded');
  }

  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      'https://restcountries.com/v2/all?fields=name,flag'
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error('Could not fetch countries');
  }
}

/////////////
// CREATE

type newGuest = {
  email?: string | null;
  fullName?: string | null;

}


export async function createGuest(newGuest: newGuest) {
  const { data, error } = await supabase.from('guests').insert([newGuest]);

  if (error) {
    console.error(error);
    throw new Error('Guest could not be created');
  }

  return data;
}





// export async function createBooking(newBooking: BookingInsert) {
//   const { data, error } = await supabase
//     .from('bookings')
//     .insert([newBooking])
//     // So that the newly created object gets returned!
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error('Booking could not be created');
//   }

//   return data;
// }

/////////////
// UPDATE




// // The updatedFields is an object which should ONLY contain the updated data
// export async function updateGuest(id: number, updatedFields: newGuest) {
//   const { data, error } = await supabase
//     .from('guests')
//     .update(updatedFields)
//     .eq('id', id)
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error('Guest could not be updated');
//   }
//   return data;
// }

// export async function updateBooking(id: number, updatedFields: Booking) {
//   const { data, error } = await supabase
//     .from('bookings')
//     .update(updatedFields)
//     .eq('id', id)
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error('Booking could not be updated');
//   }
//   return data;
// }

// /////////////
// // DELETE

// export async function deleteBooking(id: number) {
//   const { data, error } = await supabase.from('bookings').delete().eq('id', id);

//   if (error) {
//     console.error(error);
//     throw new Error('Booking could not be deleted');
//   }
//   return data;
// }

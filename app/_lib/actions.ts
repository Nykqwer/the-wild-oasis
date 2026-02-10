"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBooking, getBookings } from "./data-service";
import { redirect } from "next/navigation";

export type BookingData = {
  startDate: Date;
  endDate: Date;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
};



export async function createBooking(
  bookingData: BookingData,
  formData: FormData
) {

  const session = await auth();
  if (!session?.user?.guestId) {
    throw new Error("You must be logged in to create a booking");
  }

  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations");

  if (!Number.isInteger(numGuests) || numGuests <= 0) {
    throw new Error("Number of guests must be a valid positive number");
  }

  if (
    observations &&
    (typeof observations !== "string" || observations.length > 1000)
  ) {
    throw new Error("Observations must be a string up to 1000 characters");
  }

  if (!bookingData.startDate || !bookingData.endDate) {
    throw new Error("Start date and end date are required");
  }

  if (bookingData.numNights <= 0) {
    throw new Error("Number of nights must be greater than zero");
  }

  if (bookingData.cabinPrice <= 0) {
    throw new Error("Invalid cabin price");
  }


  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests,
    observations: observations?.toString().slice(0, 1000) ?? null,
    extraPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed" as const,
  };

  // 💾 Insert booking
  const { data, error } = await supabase
    .from("bookings")
    .insert(newBooking)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou")
}

export async function updateGuest(formData: FormData){
    const session = await auth();

    if(!session) throw new Error("You must be logged in");
    const nationalIDValue = formData.get("nationalID");

    if (typeof nationalIDValue !== "string") {
    throw new Error("National ID is missing or invalid");
    }

    const nationalIDRegex = /^[A-Za-z0-9]{6,12}$/;

    if (!nationalIDRegex.test(nationalIDValue)) {
    throw new Error("National ID must be 6–12 alphanumeric characters");
    }

    const nationalID = nationalIDValue;


   const nationalityValue = formData.get("nationality");

    if (typeof nationalityValue !== "string") {
    throw new Error("Nationality is missing or invalid");
    }

    const [nationality, countryFlag] = nationalityValue.split("%");

    const updateData = {nationalID, nationality, countryFlag};

    const { data, error } = await supabase
    .from('guests')
    .update(updateData) 
    .eq('id', session.user.guestId)

  if (error) throw new Error('Guest could not be updated');

  revalidatePath("/account/profile");
}



export async function updateReservation(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const id = formData.get("id");
  if (!id) throw new Error("ID is required");

  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations");

  const bookingId = Number(id);

  // Authorization check
  const guestBookings = await getBookings(session.user.guestId);
  const allowedBookingIds = guestBookings.map(b => b.id);

  if (!allowedBookingIds.includes(bookingId)) {
    throw new Error("You are not allowed to update this booking");
  }

  const updateData: {
    numGuests?: number;
    observations?: string;
  } = {};

  if (numGuests) updateData.numGuests = Number(numGuests);
  if (typeof observations === "string") {
    updateData.observations = observations.slice(0, 1000);
  }

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect("/account/reservations");
}

export  async function deleteBooking(bookingId: number){
    const session = await auth();
    if(!session) throw new Error("You must be logged in");


    const guestBookings = await getBookings(session.user.guestId);
    const guestBookingIds = guestBookings.map((booking) => booking.id);

    if(!guestBookingIds.includes(bookingId)) throw new Error("You are not allowed to delete this booking")

    const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);
    if (error) {
       
        throw new Error('Booking could not be deleted');
    }

    revalidatePath("/account/reservation");
}

export async function signInAction(){
    await signIn('google', {redirectTo: "/account"});
}

export async function signOutAction(){
    await signOut({redirectTo: "/"});
}
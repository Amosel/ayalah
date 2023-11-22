import { createClient } from "@supabase/supabase-js";
import { RSVPDB, rsvpDBSchema, toRsvpRecord, type RSVPForm } from "./schema";

const supabaseUrl = "https://gdefxrolcugbudbphmmm.supabase.co";
export const supabase = createClient(supabaseUrl, import.meta.env.SUPABASE_KEY);

export const createRSVP = async (formData: RSVPForm) => {
  const { error, data } = await supabase
    .from("rsvps")
    .upsert(
      [
        toRsvpRecord(formData),
      ],
      { onConflict: "email" },
    )
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data.find((rsvp: any) => !!rsvp) as RSVPDB & { id: string };
};

export const getRSVPByEmail = async (email: string) =>
  supabase.from("rsvps").select("*").eq("email", email).single();
export const getRSVP = async (id: string) =>
  supabase.from("rsvps").select("*").eq("id", id).single();

// Example of fetching data from a Supabase table
export const getRSVPs = async () => {
  const { data, error } = await supabase.from("rsvps").select("*");

  if (error) {
    console.error("Error fetching data:", error);
    return null;
  }

  return data.map((rsvp: any) => rsvpDBSchema.parse(rsvp));
};

/**
 * Cancels an RSVP given the user's email.
 * @param email The email address associated with the RSVP.
 * @returns A promise that resolves when the RSVP is cancelled.
 */
export const cancelRSVP = async (email: string): Promise<void> => {
  try {
    // Fetch the RSVP data based on the email
    let response = await supabase
      .from("rsvps")
      .select("*")
      .eq("email", email)
      .single();

    if (response.error) {
      throw new Error(`RSVP not found. ${response.error}`);
    }

    // Update the RSVP to set it as cancelled
    response = await supabase
      .from("rsvps")
      .update({ iscancelled: true })
      .eq("email", email);

    if (response.error) {
      throw new Error(`setting isCancelled on RSVP failed. ${response.error}`);
    } else {
      console.log(`RSVP for ${email} has been cancelled.`);
    }
  } catch (error) {
    console.error("Error cancelling RSVP:", error);
    throw error;
  }
};

// CREATE TABLE rsvps (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL,
//   attendees INT NOT NULL,
//   dish TEXT,  -- assuming this is an optional field
//   games BOOLEAN, -- assuming this is an optional field
//   iscancelled BOOLEAN, -- assuming this is an optional field
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );

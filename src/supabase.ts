import { createClient } from "@supabase/supabase-js";
import { rsvpDBSchema, type RSVPForm } from "./schema";

const supabaseUrl = "https://gdefxrolcugbudbphmmm.supabase.co";
export const supabase = createClient(supabaseUrl, import.meta.env.SUPABASE_KEY);

export const createRSVP = async (formData: RSVPForm) => {
  return supabase
    .from("rsvps")
    .insert([formData])
    .select();
};


export const getRSVP = async (id: string) => supabase.from('rsvps').select("*").eq('id', id).single()

// Example of fetching data from a Supabase table
export const getRSVPs = async () => {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    return null;
  }

  return data.map((rsvp: any) => rsvpDBSchema.parse(rsvp));
};

// CREATE TABLE rsvps (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(255) NOT NULL,
//   email VARCHAR(255) NOT NULL,
//   attendees INT NOT NULL,
//   dishes TEXT,  -- assuming this is an optional field
//   games BOOLEAN, -- assuming this is an optional field
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );

import { send_rsvp_confirmation_email } from "~/mailer";
import { fromFormData, rsvpFormSchema } from "~/schema";
import { createRSVP } from "~/supabase";
import { Telegram } from "~/telegram";
import { appendRSVPEmail } from "~/cookies";

// Handler for POST request
export async function POST({ request }: { request: Request }) {
  try {
    const validatedData = fromFormData(await request.formData());
    const id = (await createRSVP(validatedData)).id;
    // Save the validated data and send notification
    Promise.all([
      send_rsvp_confirmation_email(validatedData, id),
      Telegram.onNewRSVP(
        validatedData,
        request.url.replace("submit-rsvp", "rsvps"),
      )]);
    // Redirect to the Thank You page
    return new Response(null, {
      status: 303, // "See Other" status code for redirect after POST
      headers: {
        Location: `/rsvp/${id}`, // URL to redirect to
        ...appendRSVPEmail(validatedData),
      },
    });
  } catch (error) {
    console.error("Error processing RSVP", error);
    return new Response("failed " + JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

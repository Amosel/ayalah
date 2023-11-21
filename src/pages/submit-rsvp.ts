import { send_rsvp_confirmation_email } from '~/mailer';
import { rsvpFormSchema } from '../schema';
import { createRSVP } from '../supabase';
import { onNewRSVP } from '../telegram';
import { appendRSVPEmail } from '~/cookies';

// Handler for POST request
export async function POST({ request }: { request: Request }) {
  const formData = await request.formData();
  const rsvp = Object.fromEntries(formData);

  try {
    const validatedData = rsvpFormSchema.parse(rsvp);
    const id = (await createRSVP(validatedData)).id;
    // Save the validated data and send notification
    await send_rsvp_confirmation_email(validatedData, id);
    await onNewRSVP(validatedData, request.url.replace("submit-rsvp", "/rsvp/"));
    // Redirect to the Thank You page
    return new Response(null, {
      status: 303, // "See Other" status code for redirect after POST
      headers: {
        'Location': `/rsvp/${id}`, // URL to redirect to
        ...appendRSVPEmail(validatedData),
      }
    });
  } catch (error) {
    console.error('Error processing RSVP', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


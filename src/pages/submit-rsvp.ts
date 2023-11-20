import { send_confirmation } from '~/mailer';
import { rsvpFormSchema, type RSVPDB, RSVPForm } from '../schema';
import { createRSVP } from '../supabase';
import { onNewRSVP } from '../telegram';
import { appendRSVPId } from '~/cookies';

const validate_create_rsvp = async (validatedData: RSVPForm) => {
  const { error, data } = await createRSVP(validatedData);
  if (error) {
    throw new Error(error.message);
  }
  const id = (data.find((rsvp: any) => !!rsvp) as RSVPDB & { id: string }).id;
  if (!id) {
    throw new Error('No data returned from Supabase');
  } else {
    console.log("inserted", id);
  }
  return id;
}

// Handler for POST request
export async function POST({ request }: any) {
  const formData = await request.formData();
  const rsvp = Object.fromEntries(formData);

  try {
    const validatedData = rsvpFormSchema.parse(rsvp);
    const id = await validate_create_rsvp(validatedData);
    // Save the validated data and send notification
    await send_confirmation(validatedData, id);
    const location = `/rsvp/${id}`;
    const url = new URL(request.url);
    url.pathname = location;
    await onNewRSVP(validatedData, request.url + '/rsvps/');
    // Redirect to the Thank You page
    return new Response(null, {
      status: 303, // "See Other" status code for redirect after POST
      headers: {
        'Location': location, // URL to redirect to
        ...appendRSVPId(id),
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


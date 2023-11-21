// Import necessary dependencies
import { z } from 'zod';
import { cancelRSVP } from '~/supabase';
import { onRSVPCancelled } from '~/telegram';

const schema = z.object({
  email: z.string().email(),
});

export async function POST({ request }: any) {
  try {
    // Validate the data with Zod
    let { email } = schema.parse(
      Object.fromEntries(
        await request.formData()
      )
    );

    // If validation is successful, process the form submission (e.g., cancel RSVP)
    cancelRSVP(email);
    await onRSVPCancelled(email, request.url + '/attendees/');
    return new Response(null, {
      status: 303, // "See Other" status code for redirect after POST
      headers: {
        'Location': `/`, // URL to redirect to
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues[0].message), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
      
    } else {
      // Handle other errors as needed
      return new Response('An unexpected error occurred', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}

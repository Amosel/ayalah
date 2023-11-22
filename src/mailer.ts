import sgMail from '@sendgrid/mail';
import { RSVPForm } from './schema';
import { email_template } from './data';

const api_key = import.meta.env.SENDGRID_API_KEY
sgMail.setApiKey(api_key!);
export const send_rsvp_confirmation_email = async (rsvp: RSVPForm, _: string) => {
  const msg = email_template(rsvp.email);
  try {
    // @ts-ignore
    const response = await sgMail.send(msg);
    // Handle successful email sending
    console.log(`Sendgrid success ${response[0].statusCode}, ${msg}`);
  } catch (error) {
    // Handle errors
    console.error(`sendgrid error: ${error}, ${api_key}`);
  }
}
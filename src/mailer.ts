import sgMail from '@sendgrid/mail';
import { RSVPForm } from './schema';

const api_key = import.meta.env.SENDGRID_API_KEY
sgMail.setApiKey(api_key!);
export const send_confirmation = async (rsvp: RSVPForm, _: string) => {
  const msg = {
    to: rsvp.email,
    from: 'amosel@gmail.com',
    subject: "Ayalah's brithday RSVP Confirmation",
    dynamic_template_data: {
      dateAndTime: 'Sunday, Dec 3rd, 2pm- 6pm',
      address: '2467 Back River Rd, Delancey, NY 13752',
      encodedAddress: encodeURIComponent('2467 Back River Rd, Delancey, NY 13752')
    },
    template_id: 'd-e3e60cff1f9b41abbedb2198ecbd01a7'
  };
  try {
    // @ts-ignore
    const response = await sgMail.send(msg);
    // Handle successful email sending
    console.error(`Sendgrid success ${response[0].statusCode}`);
  } catch (error) {
    // Handle errors
    console.error(`sendgrid error: ${error}, ${api_key}`);
  }
}
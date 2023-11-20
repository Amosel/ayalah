import sgMail from '@sendgrid/mail';
import { RSVPForm } from './schema';
import { birthday_date, brithday_address } from './data';

const api_key = import.meta.env.SENDGRID_API_KEY
sgMail.setApiKey(api_key!);
export const send_confirmation = async (rsvp: RSVPForm, _: string) => {
  const msg = {
    to: rsvp.email,
    from: 'amosel@gmail.com',
    replyTo: 'amosel@gmail.com',
    subject: "Ayalah's brithday RSVP Confirmation",
    dynamic_template_data: {    
      dateAndTime: birthday_date,
      address: brithday_address,
      encodedAddress: encodeURIComponent(brithday_address)
    },
    template_id: 'd-e3e60cff1f9b41abbedb2198ecbd01a7'
  };
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
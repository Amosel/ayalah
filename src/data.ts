export const birthday_date = 'Sunday, Dec 3rd, 2pm- 6pm';
export const brithday_address = '2467 Back River Rd, Delancey, NY 13752';
export const brithday_address_casusal = '2467 Back River Rd, Delancey';
export const birthday_directions_google = 'https://maps.app.goo.gl/Q8nJEm5ooerivagJ9';
export const birthday_directions_apple = "http://maps.apple.com/?q=2467+Back+River+Road";

export const email_template = (email: string) => ({
  to: email,
  from: 'amosel@gmail.com',
  replyTo: 'amosel@gmail.com',
  subject: "Ayalah's brithday RSVP Confirmation",
  dynamic_template_data: {
    dateAndTime: birthday_date,
    address: brithday_address,
    encodedAddress: encodeURIComponent(brithday_address)
  },
  template_id: 'd-e3e60cff1f9b41abbedb2198ecbd01a7'
});

export const telegran_new_rsvp_template = ({ name, url }: { name: string, url: string }) => `<b>New RSVP from ${name}!</b> Open <a href="${url}">Open RSVPs</a>`;
export const telegran_rsv_canclled = ({ email, url }: { email: string, url: string }) => `<b>${email}! Cancelled</b> Open <a href="${url}">Open RSVPs</a>`;
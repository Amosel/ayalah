// @ts-ignore
import { parse } from 'cookie';
import { RSVPForm } from './schema';

const secureAttribute = import.meta.env.NODE_ENV === 'production' ? '; Secure' : '';

export const appendRSVPEmail = ({ email }:RSVPForm) => ({
  'Set-Cookie': `email=${email}; Path=/; HttpOnly${secureAttribute}; SameSite=Strict`, // Set the cookie to the RSVP ID
});
export const extractRSVPEmail = (request: Request) => {
  const cookies = parse(request.headers.get('cookie') || '');
  return cookies.email;
}

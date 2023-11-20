// @ts-ignore
import { parse } from 'cookie';

const secureAttribute = import.meta.env.NODE_ENV === 'production' ? '; Secure' : '';

export const appendRSVPId = (id: string) => ({
  'Set-Cookie': `rsvpId=${id}; Path=/; HttpOnly${secureAttribute}; SameSite=Strict`, // Set the cookie to the RSVP ID
});

export const extractRSVPId = (request: Request) => {
  const cookies = parse(request.headers.get('cookie') || '');
  return cookies.rsvpId;
}

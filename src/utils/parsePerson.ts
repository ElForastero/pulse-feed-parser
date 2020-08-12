import { Person } from '../types';

const emailNameRgx = new RegExp(/^([^@]+@[^\s]+)\s+\(([^@]+)\)$/);
const nameEmailRgx = new RegExp(/^([^@]+)\s+\(([^@]+@[^)]+)\)$/);
const nameOnlyRgx = new RegExp(/^([^@()]+)$/);
const emailOnlyRgx = new RegExp(/^([^@()]+@[^@()]+)$/);

// ParseNameAddress parses name/email strings commonly
// found in RSS feeds of the format "Example Name (example@site.com)"
// and other variations of this format.
export const parsePerson = (data: string): Maybe<Person> => {
  if (emailNameRgx.test(data)) {
    const [email, name] = data.match(emailNameRgx)!;

    return {
      name,
      email,
    };
  } else if (nameEmailRgx.test(data)) {
    const [name, email] = data.match(nameEmailRgx)!;

    return {
      name,
      email,
    };
  } else if (nameOnlyRgx.test(data)) {
    const [name] = data.match(nameOnlyRgx)!;

    return { name, email: null };
  } else if (emailOnlyRgx.test(data)) {
    const [email] = data.match(emailOnlyRgx)!;

    return {
      name: null,
      email,
    };
  }

  return null;
};

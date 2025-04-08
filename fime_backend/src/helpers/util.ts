import { hash } from 'bcrypt';

// saltRounds is the cost factor for hashing, which determines how computationally expensive the hashing process is.
// A higher number means more security but also more time to hash.
const saltRounds = 10;

export const hashPasswordHelper = async (
  plainPassword: string,
): Promise<string | undefined> => {
  try {
    return await hash(plainPassword, saltRounds);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};

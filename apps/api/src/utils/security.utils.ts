import * as bcrypt from 'bcrypt';

export const getHash = (text: string) => {
  return bcrypt.hash(text, 10);
};

export const compareTextWithHash = (text: string, hash: string) => {
  return bcrypt.compare(text, hash);
};

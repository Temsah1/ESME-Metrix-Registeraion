import { customAlphabet } from "nanoid";

// Unambiguous charset (no 0/O/1/I/l) per master plan §9.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const generate = customAlphabet(ALPHABET, 6);

export const REGISTRATION_ID_REGEX = /^MX8-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;

export function generateRegistrationId(): string {
  return `MX8-${generate()}`;
}
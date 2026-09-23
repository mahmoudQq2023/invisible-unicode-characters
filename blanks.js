/**
 * invisible-unicode-characters — the blank characters apps actually keep, and a
 * detector for text that only looks empty.
 *
 *   import { BLANKS, blankFor, isVisuallyBlank, revealInvisible } from './blanks.js';
 *   blankFor('WhatsApp')              // → '\u2800'
 *   isVisuallyBlank('\u3164\u200B')   // → true
 *   revealInvisible('a\u200Bb')       // → 'a[U+200B]b'
 *
 * MIT. Data: blanks.json in the same repository.
 */

export const BLANKS = {
  HANGUL_FILLER: '\u3164',          // game nicknames, TikTok, Instagram name
  BRAILLE_BLANK: '\u2800',          // blank chat messages and comments
  ZERO_WIDTH_SPACE: '\u200B',       // X posts, Notes; stripped by chat apps
  INVISIBLE_SEPARATOR: '\u2063',    // Facebook, Messenger
  HALFWIDTH_HANGUL_FILLER: '\uFFA0' // fallback when U+3164 is rejected
};

const BY_APP = {
  whatsapp: BLANKS.BRAILLE_BLANK,
  telegram: BLANKS.BRAILLE_BLANK,
  discord: BLANKS.BRAILLE_BLANK,
  'instagram comment': BLANKS.BRAILLE_BLANK,
  instagram: BLANKS.HANGUL_FILLER,
  tiktok: BLANKS.HANGUL_FILLER,
  'free fire': BLANKS.HANGUL_FILLER,
  pubg: BLANKS.HANGUL_FILLER,
  bgmi: BLANKS.HANGUL_FILLER,
  x: BLANKS.ZERO_WIDTH_SPACE,
  twitter: BLANKS.ZERO_WIDTH_SPACE,
  facebook: BLANKS.INVISIBLE_SEPARATOR,
  messenger: BLANKS.INVISIBLE_SEPARATOR,
};

/** The blank character that app keeps, or U+2800 as the safest general default. */
export function blankFor(app) {
  return BY_APP[String(app).trim().toLowerCase()] ?? BLANKS.BRAILLE_BLANK;
}

// Characters that render as nothing, or as a blank an app keeps.
const INVISIBLE = new Set([
  0x200B, 0x200C, 0x200D, 0x2060, 0xFEFF, 0x2800, 0x3164, 0xFFA0, 0x2063, 0x2064,
  0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009,
  0x200A, 0x202F, 0x205F, 0x3000, 0x180E, 0x00A0, 0x034F, 0x061C, 0x115F, 0x1160,
  0x0020, 0x0009, 0x000A, 0x000D,
]);

/** True when the string has at least one character and none of them is visible. */
export function isVisuallyBlank(str) {
  const cps = [...String(str)].map((c) => c.codePointAt(0));
  return cps.length > 0 && cps.every((cp) => INVISIBLE.has(cp));
}

/** Replace every invisible character except ordinary spaces and newlines with [U+XXXX]. */
export function revealInvisible(str) {
  return [...String(str)].map((c) => {
    const cp = c.codePointAt(0);
    if (cp === 0x20 || cp === 0x0A || cp === 0x0D || cp === 0x09 || !INVISIBLE.has(cp)) return c;
    return `[U+${cp.toString(16).toUpperCase().padStart(4, '0')}]`;
  }).join('');
}

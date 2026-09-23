# invisible-unicode-characters

The blank and invisible Unicode characters that apps **actually keep**, in one JSON file, plus a
tiny JavaScript helper to pick the right one and to detect text that only looks empty.

"Copy an invisible character" advice usually hands everyone `U+200B`. Most chat apps strip it
before sending, and game nickname fields reject it. Which blank survives depends on the app and
on the field — a message box, a display name and a username behave differently in the same app.

## Which character for which app

| App | Field | Character | Result |
|---|---|---|---|
| WhatsApp | message | `U+2800` Braille Pattern Blank | works — U+200B/U+200C are stripped, the message is rejected as empty |
| Instagram | name, bio lines | `U+3164` Hangul Filler | works — the username field takes only letters, digits, `.` and `_` |
| Instagram | comment | `U+2800` | works |
| TikTok | nickname, bio | `U+3164` | works |
| Discord | message | `U+2800` | works — a server nickname can be blank with U+3164 |
| Free Fire | nickname | `U+3164` | works — one character, two if the game says the name is too short |
| PUBG Mobile, BGMI | nickname | `U+3164` | works — needs a rename card |
| Telegram | message, name | `U+2800` | works — U+200B is stripped |
| X (Twitter) | post, display name | `U+200B` Zero-Width Space | works — runs of normal spaces are collapsed |
| iPhone Notes / iMessage | note / message | `U+200B` / `U+2800` | Notes keeps U+200B; iMessage needs U+2800 |
| Roblox | display name | `U+3164` | test first — changes with updates |
| Fortnite | Epic display name | `U+2800` | test first — one change every two weeks |

Full data with HTML entities and CSS escapes for twelve characters: [`blanks.json`](blanks.json).

## JavaScript

```js
import { BLANKS, blankFor, isVisuallyBlank, revealInvisible } from './blanks.js';

blankFor('WhatsApp');             // '\u2800'
blankFor('Free Fire');            // '\u3164'
isVisuallyBlank('\u3164\u200B');  // true  — useful for form validation
revealInvisible('pay\u200Bpal');  // 'pay[U+200B]pal' — spot hidden characters in pasted text
```

`isVisuallyBlank` is the check most sign-up forms are missing: `str.trim() === ''` does not
catch U+3164 or U+2800, so "empty" usernames get through.

## Try them without code

- Copy any of these characters, or test whether a pasted string contains hidden ones, on the
  [invisible text tool](https://confileo.com/tools/ghost-text/).
- For game and social nicknames specifically: the [invisible name generator](https://confileo.com/tools/invisible-name-generator/).

## Licence

MIT.

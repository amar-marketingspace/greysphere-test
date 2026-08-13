# GreySphere /connect — Instructions

---

## How It All Works (Read This First)

`/connect` is **one page** — a digital business card. It never gets
duplicated per employee. Instead:

**1. `connect/people.json` — the database**
Holds one entry per person (or per referral source). This is the
only file you touch to add, edit, or remove someone.

**2. `connect/index.html` — the page + template**
Reads the `?from=` URL parameter, looks it up in `people.json`, and
fills in the name, role, greeting, WhatsApp link, phone, and email.
You never duplicate this file per person.

**3. The URL parameter — which profile loads**
```
https://greysphere.in/connect/?from=amar
https://greysphere.in/connect/?from=neha
https://greysphere.in/connect/               ← no param = company default
https://greysphere.in/connect/?from=anything-unknown  ← also company default
```

This is the same pattern the blog system uses with `blogs/data.json`
— one template, data-driven content. You never touch `index.html`
just to add a new person.

---

## File Structure

```
connect/
├── index.html              ← The page. Don't duplicate this per person.
├── people.json              ← THE DATABASE — edit this to add/change a person
├── photos/                  ← Profile photos (optional — see below)
│   ├── amar.jpg
│   └── neha.jpg
└── CONNECT-INSTRUCTIONS.md  ← This file
```

`index.html` sits inside `connect/`, so it loads shared assets with
`../` — same convention as `blogs/*.html`:
```html
<link rel="stylesheet" href="../global.css" />
<script src="../global.js"></script>
```

---

## How to Add a New Person

Two steps. Takes 2 minutes.

### Step 1 — Add an entry to `people.json`

Open `connect/people.json` and add a new key. The key is whatever
you'll use in the QR code's URL.

```json
"priya": {
  "name": "Priya",
  "isCompany": false,
  "designation": "Head of Strategy",
  "greeting": "Good to meet you.",
  "photo": "photos/priya.jpg",
  "whatsapp": "91XXXXXXXXXX",
  "whatsappMessage": "Hey Priya, good to connect! I'd like to talk about",
  "phoneDisplay": "+91 XXXXX XXXXX",
  "phoneDial": "+91XXXXXXXXXX",
  "email": "priya@greysphere.in"
}
```

**Field reference:**

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | First name is enough — shown as the big serif headline |
| `isCompany` | Yes | `false` for a person, `true` for a company/referral profile |
| `designation` | Yes (if `isCompany: false`) | Shown under the name |
| `greeting` | Yes | The small line above the name, e.g. "Good to meet you." |
| `photo` | No | Path from inside `connect/`, e.g. `photos/priya.jpg`. Omit the field entirely if you don't have a photo yet — see "Profile Photos" below. Never set on a company (`isCompany: true`) entry — it's ignored there. |
| `whatsapp` | Yes | Number **with country code, no `+`, no spaces** (e.g. `919788966664`) — this is the `wa.me/` format |
| `whatsappMessage` | Yes | Pre-filled opening line in the WhatsApp chat. Personalise it per person. |
| `phoneDisplay` | Yes | Human-readable, shown on the button, e.g. `+91 97889 66664` |
| `phoneDial` | Yes | Used in the `tel:` link — keep the `+`, no spaces, e.g. `+919788966664` |
| `email` | Yes | Used for both display and the `mailto:` link |

**Critical JSON rules:**
- Every object separated by a comma; no comma after the last one
- All keys and string values use double quotes, never single quotes
- Validate at [jsonlint.com](https://jsonlint.com) before pushing if unsure — the page fails silently to the company default on bad JSON

### Step 2 — Add a profile photo (optional)

1. Prepare a **square image, at least 400×400px, JPG, under 200KB**
2. Name it to match the `photo` path you used in `people.json` — e.g. `amar.jpg`
3. Save it to `connect/photos/`
4. If you skip this entirely (no `photo` field, or the file is missing/fails to load), the page automatically shows a circular navy-and-amber avatar with the person's first initial instead — nothing breaks either way.

### Step 3 — Generate the QR code

Point the QR code at:
```
https://greysphere.in/connect/?from=priya
```
Print it on the card. Nothing else to build — the page is already live.

---

## The `default` Entry — Company / Generic Referral Cards

`people.json` includes a `"default"` entry. This loads when:
- No `?from=` parameter is present (someone types `/connect/` directly)
- An unrecognised `?from=` value is used
- `?from=greysphere` is explicitly used

Use this for generic company cards, event handouts, or any card that
isn't tied to one person. Edit `default` the same way as a person
entry, but set `"isCompany": true` and leave `designation` as the
company tagline (e.g. "Consulting + Marketing Partner").

---

## Removing or Updating Someone

- **Update:** edit their object in `people.json` directly — no need to touch `index.html`.
- **Remove:** delete their object from `people.json`. Their QR code will now fall back to the `default` (company) profile rather than 404 — old printed cards won't break, they'll just stop being personalised. Physically retire the card when convenient.

---

## Why One Page Instead of One Page Per Person

If GreySphere ends up with 20 team members, creating
`connect-amar.html`, `connect-neha.html`, `connect-priya.html`, etc.
means 20 files to keep in sync with every design change.

Instead, the layout lives in exactly one file (`index.html`).
Only `people.json` grows. A future design change — new CTA copy, a
new section, a colour update — is made once and applies to every
person automatically.

---

## What the Page Does NOT Do (By Design)

This is deliberately **not** a homepage. Per the approved
architecture:
- No full navigation dump of the entire site — the "Explore
  GreySphere" section at the bottom is intentionally just 4 links
- No long scroll — the primary CTA ("Start a Conversation") appears
  within the first screen on mobile
- Only one primary (amber) CTA per screen — WhatsApp is the primary
  action; Call, Email, and Save Contact are secondary
- No sensitive/internal data in `people.json` — only what's safe to
  expose publicly through a URL parameter (name, title, work contact
  details). Never put personal mobile numbers, personal addresses,
  or internal notes in this file.

---

## SEO Note

`/connect/` is intentionally **excluded from `sitemap.xml`** and
carries `<meta name="robots" content="noindex, follow">`. It's a
QR-triggered "digital business card," not a page meant to rank in
search — every `?from=` variant shows the same underlying page, so
indexing it would just create duplicate-content noise. Do not add it
to the sitemap or remove the noindex tag.

---

## Troubleshooting

**Page shows the GreySphere default instead of the person I expected**
- Check the `?from=` value in the URL matches a key in `people.json` exactly (lowercase, no typos)
- Check `people.json` is valid — a broken comma makes the whole file fail to parse, and the page silently falls back to the hardcoded default

**WhatsApp button doesn't open a chat**
- `whatsapp` must be digits only, with country code, no `+`, no spaces, no dashes (e.g. `919788966664`, not `+91 97889 66664`)

**Call button dials the wrong format / doesn't work on iPhone**
- `phoneDial` must include the `+` and no spaces (e.g. `+919788966664`)

**Save Contact downloads a file with no name / wrong name**
- Check `name`, `designation`, `email`, and `phoneDial` are all filled in for that person — the vCard is built from these fields directly

**Profile photo not showing**
- Confirm the filename in `people.json` (`"photo": "photos/amar.jpg"`) matches the actual file in `connect/photos/` exactly — GitHub paths are case-sensitive
- If the file is genuinely missing or fails to load, the page falls back to a navy/amber initial-letter avatar automatically — this is expected, not a bug
- Company/referral entries (`isCompany: true`) never show a photo, even if a `photo` field is present

**New person not showing up after editing `people.json`**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Confirm the file was committed and pushed to GitHub Pages
- Confirm you're testing via a real URL (`https://...` or a local server), not opening the file directly as `file://` — `fetch()` is blocked on `file://`, same as the blog system

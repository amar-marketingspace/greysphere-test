# GreySphere Blog System — Instructions

---

## How It All Works (Read This First)

The blog system has three moving parts:

**1. `blogs/data.json` — the database**
The only file you touch every time you publish a post. It holds card-level metadata for every post: title, date, category, excerpt, thumbnail path, read time, and the path to the HTML file. It does not contain the article body.

**2. Individual post HTML files — the actual articles**
Each post is its own HTML file inside the `blogs/` folder. This is where the full article content lives. The JSON just points to it.

**3. Two pages that read the JSON automatically**
- `blog.html` — reads all posts, renders them as a filterable grid
- `index.html` — reads the same JSON, shows only the latest 3 in the Blog section

You never touch `blog.html` or `index.html` when publishing a new post. Update the JSON, add the HTML file, push — done.

---

## File Structure

```
/ (root)
├── index.html                        ← Homepage — Blog section auto-updates from JSON
├── blog.html                         ← Blog listing page — all posts, filterable by category
├── global.css                        ← Shared styles (includes .btn-outline)
├── global.js                         ← Shared nav, footer, scroll reveal
├── header.html                       ← Shared nav fragment
├── footer.html                       ← Shared footer fragment
│
├── blogs/
│   ├── data.json                     ← THE DATABASE — edit this for every new post
│   ├── blog post-template.html       ← Copy this to create every new post
│   ├── why-branding-matters.html     ← Sample post 1
│   └── seo-for-indian-startups.html  ← Sample post 2
│
└── assets/
    └── blog/
        ├── branding-thumb.jpg        ← Thumbnail for sample post 1
        └── seo-thumb.jpg             ← Thumbnail for sample post 2
```

---

## How global.js Works With Blog Posts (Important)

`global.js` injects `header.html` and `footer.html` into every page automatically. It resolves these paths relative to the current page's depth — so it works correctly whether the page is at the root (`index.html`) or one level deep (`blogs/your-post.html`). You do not need to change anything in `global.js` when adding new posts.

Each blog post file loads global.js with `<script src="../global.js"></script>` — the `../` goes up one level from `blogs/` to the root where `global.js` lives.

---

## How to Publish a New Blog Post

Four steps. Takes 10–15 minutes per post.

---

### Step 1 — Choose a slug

A slug is the URL-friendly identifier for your post. It becomes the file name and forms the URL.

**Rules:**
- Lowercase only
- Words separated by hyphens, no spaces
- Keep it short and descriptive
- No special characters

**Examples:**
```
how-to-choose-a-marketing-agency
content-marketing-for-b2b-brands
rebranding-case-study-2025
why-consistency-beats-creativity
```

---

### Step 2 — Create the post HTML file

1. Open the `blogs/` folder
2. Duplicate `blog post-template.html`
3. Rename the copy to `YOUR-SLUG.html`
   e.g. `how-to-choose-a-marketing-agency.html`
4. Open it and fill in the three marked sections:

---

**STEP 1 inside the template — Meta fields in `<head>`**

```html
<title>Your Post Title — GreySphere Blog</title>
<meta name="description" content="Your 1–2 sentence excerpt here." />
<meta property="og:title" content="Your Post Title" />
<meta property="og:description" content="Your 1–2 sentence excerpt here." />
<meta property="og:image" content="../assets/blog/your-thumbnail.jpg" />
```

The `og:` fields control how the link appears when shared on WhatsApp, LinkedIn, or Twitter.

---

**STEP 2 inside the template — Hero section**

```html
<p class="post-category">Marketing & Branding</p>
<h1 class="post-title">Your Post Title Goes Here</h1>

<div class="post-meta">
  <span>10 May 2025</span>
  <span class="dot"></span>
  <span>5 min read</span>
</div>
```

The date must match the `date` field in `data.json`.
If you have no thumbnail image yet, delete the entire `<div class="post-image-wrap">` block — nothing will break.

---

**STEP 3 inside the template — Article body**

Write your content inside `<article class="post-body">`. Available elements:

| Element | Use for |
|---|---|
| `<p>` | Body paragraph |
| `<h2>` | Major section heading |
| `<h3>` | Minor sub-heading |
| `<ul><li>` | Bullet list |
| `<ol><li>` | Numbered list |
| `<blockquote><p>` | Pull quote (renders with amber left border) |
| `<a href="">` | Hyperlink |

Aim for 600–1200 words.

---

### Step 3 — Add an entry to `blogs/data.json`

Open `blogs/data.json`. Add a new object to the top of the array (newest first).

**A single post entry:**

```json
{
  "slug": "your-slug-here",
  "title": "Your Full Post Title",
  "date": "2025-05-10",
  "category": "Marketing & Branding",
  "excerpt": "Your 1–2 sentence teaser. Shown on the blog listing page and homepage blog cards.",
  "thumbnail": "assets/blog/your-thumbnail.jpg",
  "readTime": "5 min read",
  "file": "blogs/your-slug-here.html"
}
```

**The full file with multiple posts:**

```json
[
  {
    "slug": "your-new-post",
    "title": "Your New Post Title",
    "date": "2025-05-10",
    "category": "Business Strategy",
    "excerpt": "Teaser for the new post.",
    "thumbnail": "assets/blog/new-post-thumb.jpg",
    "readTime": "4 min read",
    "file": "blogs/your-new-post.html"
  },
  {
    "slug": "why-branding-matters",
    "title": "Why Branding Matters More Than You Think",
    "date": "2025-04-10",
    "category": "Marketing & Branding",
    "excerpt": "Most businesses treat branding as a logo and a colour palette. The ones that win treat it as a language.",
    "thumbnail": "assets/blog/branding-thumb.jpg",
    "readTime": "5 min read",
    "file": "blogs/why-branding-matters.html"
  },
  {
    "slug": "seo-for-indian-startups",
    "title": "SEO for Indian Startups: Where to Begin",
    "date": "2025-03-22",
    "category": "SEO & Digital",
    "excerpt": "Search engine optimisation is not a one-time task. For Indian startups entering competitive markets, it is the compounding asset that pays dividends for years.",
    "thumbnail": "assets/blog/seo-thumb.jpg",
    "readTime": "7 min read",
    "file": "blogs/seo-for-indian-startups.html"
  }
]
```

**Critical JSON rules:**
- Every object separated by a comma
- No comma after the very last object
- All keys and string values use double quotes, never single quotes
- Validate at [jsonlint.com](https://jsonlint.com) before pushing if unsure

---

**Field reference:**

| Field | Required | Notes |
|---|---|---|
| `slug` | Yes | Lowercase with hyphens. Reference only — does not affect routing. |
| `title` | Yes | Full post title shown on cards |
| `date` | Yes | Format: `YYYY-MM-DD`. Used for sorting newest-first. |
| `category` | Yes | Must match one of the defined categories exactly |
| `excerpt` | Yes | 1–2 sentences. Shown on blog listing cards and homepage blog cards. |
| `thumbnail` | Optional | Path from site root: `assets/blog/filename.jpg`. Navy placeholder shown if omitted. |
| `readTime` | Yes | ~200 words per minute. 1000-word post = 5 min read. |
| `file` | Yes | Path from site root: `blogs/your-slug.html` |

---

**Available categories:**
- `Marketing & Branding`
- `SEO & Digital`
- `Business Strategy`
- `Case Studies`
- `Industry Trends`

To add a new category, simply use it in the JSON. The filter bar on `blog.html` builds itself dynamically from whatever categories exist in the data — no code change needed.

---

### Step 4 — Add the thumbnail image

1. Prepare image: **1200×675px, JPEG, under 200KB** (16:9 ratio)
2. Name it to match your slug: `your-slug-thumb.jpg`
3. Save to `assets/blog/`
4. Filename must match exactly what's in `data.json` and the post HTML — GitHub paths are case-sensitive

**No image yet?** Skip this step. A navy gradient placeholder renders automatically. Add the image later and it picks up immediately on the next push.

---

### Step 5 — Commit and push

```bash
git add .
git commit -m "Add post: Your Post Title"
git push
```

GitHub Pages deploys in 30–60 seconds. Both `blog.html` and the homepage Blog section update automatically.

---

## Where Content Appears — Summary

| What you add | Where it shows up automatically |
|---|---|
| New entry in `data.json` | Blog listing page (all cards) + Homepage (if it's one of the 3 newest) |
| New `.html` file in `blogs/` | Accessible via card link only — invisible until added to JSON |
| New thumbnail in `assets/blog/` | Picked up by any JSON entry that references it |

**The homepage always shows the 3 most recent posts by date.** Publish a 4th post and the oldest drops off the homepage automatically.

---

## Image Path Reference

| File being edited | Correct thumbnail path |
|---|---|
| `blogs/data.json` | `assets/blog/filename.jpg` |
| `blogs/your-post.html` | `../assets/blog/filename.jpg` |
| `index.html` or `blog.html` | handled by JS using the path from `data.json` as-is |

The `../` in post HTML files is because they sit inside `blogs/` and need to go up one level to reach `assets/`.

---

## HTML Structure of the Blog Section (index.html)

The correct nesting — do not alter this:

```html
<section class="blog-section">                ← background, padding, position
  <div class="blog-inner">                    ← max-width container, centered
    <div class="section-tag reveal">Case Studies &amp; Blogs</div>
    <h2 class="reveal delay-1">BLOG</h2>
    <div class="blog-grid" id="homeBlogsGrid">
      <!-- Cards injected here by JS -->
    </div>
    <div style="text-align: center; margin-top: 40px">
      <a href="blog.html" class="btn-outline">View all Blogs</a>
    </div>
  </div>
</section>
```

**The three rules:**
1. `class="blog-section"` on the `<section>` — not `blog-grid`
2. `id="homeBlogsGrid"` on the inner grid `<div>` — not on the `<section>`
3. The "View all Blogs" button must sit inside `<div class="blog-inner">`, not outside it

---

## Navbar

`Blog` is already a nav link in `header.html`. No changes needed when adding new posts.

---

## Troubleshooting

**Header or footer not loading on blog post pages**
- This was caused by relative path resolution in `global.js`. Confirm you have applied the `global.js` fix that uses `_base` to compute the correct path depth. After the fix, `header.html` and `footer.html` load correctly from any subfolder.

**Clicking a blog card on the homepage redirects back to homepage**
- Same root cause as above — the `global.js` path fix resolves this. After applying Fix 1, blog post pages load correctly.
- Also confirm each post file uses `<script src="../global.js"></script>` (with `../`) not `<script src="global.js"></script>`

**Cards not showing on homepage or blog.html**
- Open browser DevTools → Console and look for fetch errors
- Most common cause: opening HTML directly as a `file://` URL. Use VS Code Live Server or any local server — `fetch()` is blocked on `file://`
- Validate `data.json` at [jsonlint.com](https://jsonlint.com) — one bad comma breaks the entire fetch silently

**Section heading not visible on homepage**
- Confirm nesting matches the structure above exactly
- `class="blog-section"` must be on `<section>`, not `blog-grid`
- `id="homeBlogsGrid"` must be on the inner `<div>`, not the `<section>`

**Thumbnail not loading**
- In `data.json`: path must be `assets/blog/filename.jpg` (no `../`)
- In post HTML files: path must be `../assets/blog/filename.jpg`
- GitHub paths are case-sensitive

**Post returns 404**
- Confirm `file` field in `data.json` matches the actual filename in `blogs/` exactly
- Confirm file has been committed and pushed

**Filter bar on blog.html shows a duplicate or broken category**
- A typo in a category string creates a broken extra button — copy-paste category names rather than retyping them

**New post not appearing on homepage after push**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Confirm the new post's `date` is actually newer than the current 3 — the homepage always shows the 3 highest dates

**Author name still showing on post pages**
- Both sample posts (`why-branding-matters.html`, `seo-for-indian-startups.html`) originally had `GreySphere Team` in the `.post-meta` div
- Remove the `<span>GreySphere Team</span>` and its adjacent `<span class="dot"></span>` from both files
- The template (`blog post-template.html`) should only have date and read time in `.post-meta`

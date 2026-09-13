# Reclick Media — Website Starter

A landing page + booking backend for an on-demand video-creator booking business,
in the style of the site you showed me (Flashoot) but with original design and copy
under the Reclick Media brand.

```
reclick-media/
├── frontend/           Static site — open index.html or host anywhere
│   ├── index.html
│   ├── css/style.css
│   ├── js/main.js
│   └── assets/
├── backend/            Node/Express API for the contact form
│   ├── server.js
│   ├── routes/contact.js
│   ├── models/ContactRequest.js
│   ├── .env.example
│   └── package.json
└── README.md
```

## 1. Run the frontend

No build step needed — it's plain HTML/CSS/JS.

- Easiest: double-click `frontend/index.html`, or
- Recommended (so relative paths behave): serve it, e.g.
  ```
  cd frontend
  npx serve .
  ```

## 2. Run the backend

```
cd backend
npm install
cp .env.example .env
# now edit .env with your real values (see below)
npm start
```

The API runs at `http://localhost:4000` by default and exposes:
- `POST /api/contact` — receives booking form submissions
- `GET /api/health` — simple health check

## 3. Exactly what to change before going live

| What | File | What to put there |
|---|---|---|
| Database connection | `backend/.env` → `MONGODB_URI` | Your MongoDB Atlas (or other Mongo) connection string |
| Email notifications | `backend/.env` → `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `NOTIFY_TO_EMAIL` | Your email provider's SMTP credentials and the inbox that should get new-lead emails |
| Allowed frontend origin | `backend/.env` → `FRONTEND_ORIGIN` | The URL where you host the frontend (e.g. `https://reclickmedia.com`) |
| Frontend → backend API URL | `frontend/js/main.js` → `API_BASE_URL` | Your deployed backend URL (e.g. `https://api.reclickmedia.com`) |
| Images | Every `<img src="https://picsum.photos/...">` and `https://i.pravatar.cc/...` in `frontend/index.html` | Your own photos — same file names/paths, just point them at `assets/yourimage.jpg` |
| Logo/brand text | `frontend/index.html` → `.logo` elements, `<title>`, meta description | Your final brand copy if it differs from what's here |
| Contact details | Footer in `frontend/index.html` | Your real email/phone |
| Pricing | `#pricing` section in `frontend/index.html` | Your real prices/packages |

## 4. Adding your own "how it works" videos

The "How it works" section now shows a short vertical video per step (placeholder clips
are wired in so it works out of the box).

1. Shoot/export 4 clips, ~60 seconds or less each, vertical (9:16) — see
   `frontend/assets/videos/README.txt` for compression tips and suggested file names.
2. Drop the `.mp4` files and a poster `.jpg` (a still frame) for each into
   `frontend/assets/videos/`.
3. In `frontend/index.html`, find each `<div class="step-video">` block and change:
   ```html
   <video poster="https://picsum.photos/seed/step1/360/640" controls playsinline preload="none">
     <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4">
   </video>
   ```
   to:
   ```html
   <video poster="assets/videos/step1-poster.jpg" controls playsinline preload="none">
     <source src="assets/videos/step1-tell-us.mp4" type="video/mp4">
   </video>
   ```
   Repeat for steps 2, 3, and 4.

That's it — no JS changes needed, the browser's native video player handles play/pause/fullscreen.

## 5. Changing your database connection

1. Create a database if you don't have one yet — easiest option is a free
   [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.
2. In Atlas: **Database → Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<username>` and `<password>` with your actual database user's credentials.
4. Open `backend/.env` and paste it in:
   ```
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/reclickmedia
   ```
   (Adding `/reclickmedia` before the `?` picks a database name — you can call it anything.)
5. In Atlas, under **Network Access**, allow your server's IP (or `0.0.0.0/0` for "anywhere",
   simplest while testing, but tighten it once you're live).
6. Restart the backend (`npm start`). You should see `Connected to MongoDB` in the console.
   Contact form submissions will now be saved there.

## 6. Reviewing contacts in Excel

There's no live "Excel" database — but the backend now has a CSV export endpoint, and
CSV files open directly in Excel/Google Sheets with one click.

1. In `backend/.env`, set `ADMIN_EXPORT_KEY` to any long random string — this acts as a
   password so random people can't download your leads.
2. With the backend running, visit (in your browser, or share with whoever reviews leads):
   ```
   http://localhost:4000/api/contact/export?key=YOUR_ADMIN_EXPORT_KEY
   ```
   (swap `localhost:4000` for your real deployed backend URL once it's live)
3. This downloads `reclick-media-contacts.csv` — double-click it and it opens straight in Excel,
   with one row per submission (name, email, phone, city, content type, date, message, status).

If you'd rather have entries appear live in a Google Sheet instead of downloading a CSV each time,
that's also possible (e.g. via a Google Apps Script webhook or a service like Sheety) — let me know
and I can wire that in instead of/alongside the CSV export.

## 7. Swapping in your own images

1. Drop your image files into `frontend/assets/`.
2. In `index.html`, replace each placeholder `src="https://picsum.photos/..."` or
   `src="https://i.pravatar.cc/..."` with `src="assets/your-filename.jpg"`.

## 8. Deploying

- **Frontend**: any static host works (Netlify, Vercel, GitHub Pages, S3+CloudFront, or your own server via nginx).
- **Backend**: any Node host works (Render, Railway, a VPS with PM2, etc.). Just make sure
  your `.env` values are set on that host (most platforms let you set env vars in their dashboard
  instead of uploading the `.env` file directly).
- Remember to update `API_BASE_URL` in `main.js` to your backend's real deployed URL, and
  `FRONTEND_ORIGIN` in the backend `.env` to your frontend's real deployed URL.

## Notes

- This is an original design/build inspired by the *concept* of on-demand video-creator
  booking (like Flashoot) — it does not reuse Flashoot's code, copy, or image assets.
  You're free to restyle colors, fonts, and copy further; everything is plain CSS with
  named variables at the top of `style.css` for fast palette/typography changes.

# HapagPinoy

A web-based restaurant menu and table reservation system (MEVN stack school project): **M**ongoDB Atlas, **E**xpress, **V**ue 3, **N**ode.js.

```
hapagpinoy/
  frontend/   Vue 3 + Vite + Vue Router (the website)
  backend/    Node.js + Express + Mongoose (REST API)
```

## What the site does

- **Menu**: 35 Filipino dishes in 9 categories, loaded from MongoDB. Search, category filter and a details dialog (servings, nutrition, allergens).
- **Reservations**: book a table, optionally **pre-order your meal**, then view, edit or **cancel the booking yourself**. There is no admin dashboard: bookings are confirmed right away and only the guest can cancel them.
- **Contact**: messages are saved in MongoDB.

## Run it on localhost (VS Code, Windows)

You need Node.js 20 or newer. Open **two terminals**.

**Terminal 1: the API**

```
cd backend
npm install
npm run dev
```

You should see `Connected to MongoDB` and `HapagPinoy API running at http://localhost:5000/api`.
On the first start the menu collection is empty, so the server fills it automatically. You can also do it by hand at any time:

```
npm run seed            # saves the 35 dishes (updates existing ones, removes dishes no longer listed)
npm run seed -- --reset # empties the menu first
```

**Terminal 2: the website**

```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. In development Vite forwards `/api` to the backend, so nothing else needs configuring.

### Settings (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and fill it in. `.env` is ignored by git, so the database password is never committed.

| Variable | Meaning |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB` | Database name (the connection string has none, so it is set here; default `hapagpinoy`) |
| `PORT` | API port (default 5000) |
| `CLIENT_ORIGIN` | Website address(es) allowed to call the API (comma separated) |
| `AUTO_SEED` | `true` fills an empty menu on start-up |
| `TRUST_PROXY` | Set to `1` when deployed behind a proxy or load balancer |

If the API cannot connect to Atlas, open **Atlas > Network Access** and allow your current IP address (or `0.0.0.0/0` while testing).

## REST API

Base URL: `http://localhost:5000/api`. Successful responses are `{ "data": ... }`; errors are `{ "error": { "code", "message", "details?" } }`, where `details` maps form field names to messages.

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/health` | API and database status |
| GET | `/menu?category=&search=&featured=true` | List dishes |
| GET | `/menu/categories` | List categories |
| GET | `/menu/:idOrSlug` | One dish, e.g. `/menu/bulalo` |
| GET | `/reservations/availability?date=YYYY-MM-DD[&exclude=REF]` | Time slots for a date with seats left |
| POST | `/reservations` | **Create** a reservation (optional `preOrder`) |
| GET | `/reservations/:reference` | **Read** one reservation |
| PATCH | `/reservations/:reference` | **Update** date, time, guests, name, phone, occasion, requests or pre-order |
| DELETE | `/reservations/:reference` | **Cancel** the reservation (it is kept in the database, marked `cancelled`) |
| POST | `/contact` | Send a contact message |

Create body:

```json
{
  "name": "Juan dela Cruz", "email": "juan@example.com", "phone": "09123456789",
  "date": "2026-11-02", "time": "18:00", "guests": 4,
  "occasion": "birthday", "requests": "High chair please",
  "preOrder": [{ "itemId": "<dish id from GET /menu>", "quantity": 2 }]
}
```

### How guests prove a booking is theirs

There are no user accounts, so each booking gets:

1. a short **reference code** such as `HP-7K3M9Q`, and
2. a secret **manage token**, returned once when the booking is created. The browser keeps it and sends it as the `x-manage-token` header. Only its SHA-256 hash is stored in the database.

A booking can be read, edited or cancelled with **either** the token **or** the reference code plus the email used to book (`?email=` on GET/DELETE, `email` in the PATCH body). A wrong code and a wrong email give the same "not found" answer, and failed attempts are rate limited.

### Reservation rules (`backend/src/config/restaurant.js`)

- Opening hours, 30-minute slots, last seating 60 minutes before closing (the same numbers as `frontend/src/data/schedule.js`).
- 1 to 12 guests online; 40 seats per time slot. A full slot is refused with `SLOT_FULL`.
- Book at least 2 hours ahead and up to 90 days ahead.
- Guests can edit or cancel online until **2 hours before** the reservation (`TOO_LATE` afterwards; they are told to call).
- Up to 5 upcoming reservations per email, and no double booking of the same email at the same time.
- Pre-order: up to 20 of one dish and 60 items in total. Dish names and prices are copied into the reservation. Payment happens at the restaurant.
- All times are Philippine time (Asia/Manila), whatever the server's time zone.

## Database collections

- `menuitems`: slug, name, description, price, category, origin, badge, featured, art, tone, details (serves, nutrition, allergens, ingredients)
- `categories`: name, Filipino name, blurb, order
- `reservations`: reference, name, email, phone, date, time, startsAt, guests, occasion, requests, preOrder (items, total), status (`confirmed` / `cancelled`), cancelledAt, cancelReason, manageTokenHash
- `contactmessages`: name, email, topic, message

## Security notes

`helmet` headers, CORS limited to `CLIENT_ORIGIN`, 20 KB body limit, input checked by hand-written validators (strings only, so query operators cannot be injected), rate limits on every route (stricter for booking, failed look-ups and the contact form), a hidden honeypot field on the contact form, and no stack traces in production errors.
**Never commit `backend/.env`.** If a database password has been shared anywhere (chat, screenshots), change it in Atlas > Database Access.

## Tests

```
cd backend
npm test
```

These cover the date and slot rules, the validators and the reference/token helpers (no database needed).

## Where to edit things

- Menu dishes, prices, nutrition: `backend/src/seed/menuData.js`, then `npm run seed`
- Opening hours and booking rules: `backend/src/config/restaurant.js` **and** `frontend/src/data/schedule.js` (keep them the same)
- Address, phone, email, social links, dining-area photos: `frontend/src/data/restaurantInfo.js` (sample details)
- Colors and global styles: `frontend/src/style.css`

## Dish pictures

Each dish is shown as an illustration drawn in code (`DishArt.vue`), so it always matches its category and works offline.
Available illustration types: `appetizer`, `pasta`, `rice`, `main`, `bread`, `dessert`, `coffee`, `beverage`, `bowl` (soups and stews) and `rolls` (lumpia, turon, cheese sticks).
Each dish picks its type with `art` (or inherits it from its category) and its colour with `tone`; both are stored with the dish in MongoDB (see `backend/src/seed/menuData.js`).

Real photos (transparent WebP cut-outs) are mapped to dishes by `slug` in `frontend/src/data/dishPhotos.js` (dish dialog) and in `pickPhotos` in `views/HomeView.vue` (Chef's picks).
A dish without a photo shows its illustration.

The four cut-out images on the home page (`src/assets/hero/pasta.webp`, `coffee.webp`, `cake.webp`, `bread.webp`) are illustrations of Pancit Canton, Kapeng Barako, Leche Flan and Pandesal.
To use photos instead, replace the files with transparent WebP cut-outs of the same size (481x481, 504x485, 560x560 and 454x432); no code changes are needed.

## Hero section

- Background photo: `frontend/src/assets/hero-restaurant.jpg` (swap the file to change it). Its blur, brightness and cream wash are set in `.hero-photo` and `.hero-wash` in `views/HomeView.vue`.
- 3D plates, pointer tilt and floating chips: `frontend/src/components/HeroScene.vue`. Motion is switched off for visitors who prefer reduced motion.

## Deploying

- API: any Node host (Render, Railway, ...). Set `MONGODB_URI`, `MONGODB_DB`, `CLIENT_ORIGIN` (your website's address) and `TRUST_PROXY=1`.
- Website: build with `VITE_API_URL=https://your-api.example.com/api npm run build` (inside `frontend`) and host the `dist` folder. Configure the host to send unknown paths to `index.html` (single-page app).

## Filipino design touches (Menu, Reservations, About, Contact)

- `components/PageHeader.vue`: shared header for the four inner pages. Props: `eyebrow` (small Filipino label), `title`, `accent` (the part of the title shown in chili red with a gold squiggle), `text`, `art`, `tone`.
- `components/Garland.vue`: the banderitas (bunting) from the home hero, reusable on any page (`tone="light"` or `"dark"`).
- `style.css`: `.kicker` (small label above a heading), `.banig-strip` (woven-mat style diamond band), `.ornate` (card with the band along its top edge). The band's colors come from `--banig-url`.
- Menu: every category has a Filipino name (`local`) and a few dishes have an `origin` (shown as a pin on the card). Search also matches the Filipino category name and the origin.
- Contact: the `topic` select is pre-selected by the "large group" link on the Reservations page (`/contact?topic=group`).

## Notes

- Dining-area photos on the About page load from Unsplash. If one cannot load, a placeholder is shown.
- Reservation times use Philippine time on the server. The date picker's "today" uses the clock of the device viewing the site.
- Reservations made in a browser are remembered in its local storage (`hapagpinoy-my-reservations`: reference code and secret token) so the guest can find them under "My reservations".

## Note: We removed the assets folder containing the images because GitHub only allows files smaller than 100 files.

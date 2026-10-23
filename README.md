# Tabit Clone — Backend

REST API for a [Tabit](https://www.tabit.cloud/) clone: an Israeli restaurant reservation app. This is the final project of a course, built as a team. This repository is [Elad Levy](https://github.com/eladlevy42)'s (`@eladlevy42`) copy, published as a portfolio piece.

The team's original repositories are [Oriassia/Tabit-clone-Frontend](https://github.com/Oriassia/Tabit-clone-Frontend) and [Oriassia/Tabit-clone-Backend](https://github.com/Oriassia/Tabit-clone-Backend). The frontend fork for this portfolio is [eladlevy42/Tabit-clone-Frontend](https://github.com/eladlevy42/Tabit-clone-Frontend).

The live frontend demo is [https://tabit-clone.vercel.app](https://tabit-clone.vercel.app). This API was previously deployed at `https://tabit-clone-api.vercel.app`; that Vercel deployment is offline.

## Features

- Restaurant search and detail (location, category, name, photos, opening hours, gift-card catalog)
- Table availability by location and time, and per restaurant
- Reservations: create, update, fetch, and cancel, with a conflict check around the requested time
- Gift cards: create, look up, and redeem, with SMS via Twilio and email via nodemailer

## Tech stack

- Node.js, Express, TypeScript
- MySQL through `mysql2`, connected over SSL
- Twilio (SMS) and nodemailer (email)
- `moment-timezone` (reservation timestamps in `Asia/Jerusalem`)

## API

The server listens on `PORT` (default `3000`). JSON bodies. CORS allows `https://tabit-clone-app.vercel.app`, `http://localhost:5173`, and `http://localhost:3000`.

`GET /` returns `"Express on Vercel"`.

### `/api/tables`

| Method | Path | Handler | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/tables` | `getAvailableTables` | Query: `lat`, `lng`, `date` (required), `partySize`, `page` (default `1`). Calls `get_available_tables_nearby`. |
| `GET` | `/api/tables/:restId` | `getAllAvaliableTablesByRest` | Calls `get_available_tables_by_rest`. |
| `GET` | `/api/tables/position/:restId` | `getTablePositionsForRest` | Distinct `Tables.position` values for a restaurant. |

### `/api/restaurants`

| Method | Path | Handler | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/restaurants` | `getAllRestaurants` | Query: `category`, `lat`, `lng`, `name`, `page` (default `1`). Calls `GetAllRestaurants`. |
| `GET` | `/api/restaurants/photos/:id` | `getPhotosByRestId` | First matching row in `RestaurantsPhotos`. |
| `GET` | `/api/restaurants/now/:id` | `getAvaliableTablesForNow` | Calls `GetAvailableTablesByNow`. |
| `GET` | `/api/restaurants/giftIt` | `getGiftIt` | Query: `q`. Calls `GetGiftIt`. |
| `GET` | `/api/restaurants/:id` | `getRestaurantById` | Calls `getRestaurantById`. |
| `GET` | `/api/restaurants/hour/:restId` | `getRestaurantOpeningHours` | Row from `OpeningHours`. |

### `/api/reservations`

| Method | Path | Handler | Notes |
| --- | --- | --- | --- |
| `POST` | `/api/reservations` | `addReservation` | Body: `tableId`, `restId`, `partySize`, `firstName`, `lastName`, `phoneNumber`, `email`, `date`; `notes` optional. Returns `409` when another reservation on that table falls within 1.5 hours either side of `date`. |
| `PUT` | `/api/reservations` | `editReservation` | Body: `reservationId`, `tableId`, `newPartySize`, `newDate`. Calls `edit_reservation`. |
| `DELETE` | `/api/reservations/:reservationId` | `deleteReservation` | Deletes the row. |
| `GET` | `/api/reservations/byRestaurant` | `getReservationByRestaurantIdAndDate` | Query: `restId`, `date`. |
| `GET` | `/api/reservations/:reservationId` | `getReservationById` | Calls `get_reservation_by_id`. `date` is formatted in `Asia/Jerusalem`. |

### `/api/giftcard`

| Method | Path | Handler | Notes |
| --- | --- | --- | --- |
| `POST` | `/api/giftcard/create` | `createGiftcard` | Body: `restId`, `firstName`, `lastName`, `balance`, `senderName`, plus `phoneNumber` and/or `email`; `restaurantName` optional. Calls `InsertGiftCard`. Sends email (nodemailer / Gmail) when `email` is set and SMS (Twilio) when `phoneNumber` is set. |
| `POST` | `/api/giftcard/send-sms` | `sendSMS` | Body: `phone`, `message`. Sends that text through Twilio. |
| `GET` | `/api/giftcard/:cardId` | `getCardById` | Calls `getCardById`. |
| `DELETE` | `/api/giftcard/redeem/:cardId` | `redeemGiftcard` | Deletes the gift card. |

Express matches in registration order. `GET /api/tables/position/:restId` is registered after `GET /api/tables/:restId`, and `GET /api/restaurants/hour/:restId` is registered after `GET /api/restaurants/:id`, so those two paths are handled by the earlier parameterized routes (`restId` or `id` becomes `position` or `hour`).

## Project structure

```
src/
  index.ts                 Express app and route mounting
  config/db.ts             mysql2 connection pool (SSL)
  controllers/             Tables, Restaurant, Reservation, Giftcards
  routes/                  /api/tables, /api/restaurants, /api/reservations, /api/giftcard
  types/types.ts           Shared interfaces
sql_queries/
  SEED.sql                 Sample restaurants, tables, reservations, hours, menus, photos
  DELETE_DATA_FROM_TABLES.sql
  SELECT RESTAURANT QUERY.sql
seed.ts                    Commented-out legacy MongoDB seed (not used by the API)
public/                    Static assets shipped with the repo
dist/                      tsc output (entry: dist/index.js)
```

## Getting started

Requires Node.js and a MySQL database that already has the tables and stored procedures the controllers call (`GetAllRestaurants`, `getRestaurantById`, `get_available_tables_nearby`, `get_available_tables_by_rest`, `GetAvailableTablesByNow`, `GetGiftIt`, `edit_reservation`, `get_reservation_by_id`, `InsertGiftCard`, `getCardById`).

```bash
npm install
cp .env.example .env
```

Fill in `.env`. `DB_SSL_CA` is the CA certificate; escaped newlines (`\n`) are turned into real newlines at connect time. `MONGO_URI` and `GOOGLE_MAPS_API_KEY` are only referenced by the commented-out `seed.ts` script.

Load sample rows from `sql_queries/SEED.sql` (and clear them with `sql_queries/DELETE_DATA_FROM_TABLES.sql`) against your database. `npm run seed` runs `seed.ts`, which is fully commented out and does not write MySQL data.

```bash
npm run dev     # ts-node-dev src/index.ts
npm run build   # tsc → dist/
npm start       # node dist/index.js
```

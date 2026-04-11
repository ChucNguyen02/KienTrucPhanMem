# bai03 Frontend

Frontend for bai03/backend built with React + TypeScript + TailwindCSS.

## Features

- Create order: `POST /api/orders`
- Lookup order by ID: `GET /api/orders/{orderId}`
- Auto polling every 2.5s while status is `PENDING` or `PAID`
- Displays live status and tracking code once shipping service updates order

## Prerequisites

- Node.js 18+
- Backend services running:
  - order-service at `http://localhost:8081`
  - payment-service at `http://localhost:8082`
  - shipping-service at `http://localhost:8083`

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Vite dev server proxies `/api/*` to `http://localhost:8081` (configured in `vite.config.ts`).

## Build

```bash
npm run build
npm run preview
```

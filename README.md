# NextJS + Golang Ecommerce CMS

## Intro

### Features

-   Login page at `<domain>/login`
    -   Try the demo at [samplestore.khoiuna.info/login](https://samplestore.khoiuna.info/login).
    -   Login with username `admin` & password `admin123`.
-   Admin dashboard to add & edit products.
-   Preorder notification through Discord.

## Development

### Frontend

Built with NextJS and TailwindCSS.

1. Copy `frontend/.env.example` template & change the env variables.
2. `pnpm i` to install dependencies.
3. `pnpm dev` to run local frontend server.

### Backend

Built with Go Fiber, Gorm and SQLite.

1. Copy `backend/.env.example` template & change the env variables.
    - `openssl rand -base64 32` to generate a cookie secret for `COOKIE_SECRET`.
2. `go get .` to install Go packages.
3. `make watch` to run local backend server.

## Production

(Please contribute!)

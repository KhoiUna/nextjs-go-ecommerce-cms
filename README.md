# NextJS + Golang Ecommerce CMS

# Development

## Frontend

Built with NextJS and TailwindCSS.

## Setup

1. Copy `frontend/.env.example` template & change the env variables.
2. `pnpm i` to install dependencies.
3. `pnpm dev` to run local frontend server.

## Backend

Built with Go Fiber, Gorm and SQLite.

1. Copy `backend/.env.example` template & change the env variables.
    - `openssl rand -base64 32` to generate a cookie secret for `COOKIE_SECRET`.
2. `go get .` to install Go packages.
3. `make watch` to run local backend server.

# Production

...
